-- Create profiles table for user details
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group members table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- Create payment methods table (for storing linked cards)
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_method_id TEXT UNIQUE NOT NULL,
    card_last4 TEXT NOT NULL,
    card_brand TEXT NOT NULL,
    card_exp_month INTEGER NOT NULL,
    card_exp_year INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create virtual cards table
CREATE TABLE virtual_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL, -- 'stripe' or 'lithic'
    external_id TEXT UNIQUE NOT NULL,
    last4 TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(group_id)
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    amount INTEGER NOT NULL, -- in cents
    billing_cycle TEXT NOT NULL, -- 'monthly', 'yearly', etc.
    next_billing_date DATE NOT NULL,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    virtual_card_id UUID REFERENCES virtual_cards(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscription shares table
CREATE TABLE subscription_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    share_amount INTEGER NOT NULL, -- in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(subscription_id, user_id)
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    amount INTEGER NOT NULL, -- in cents
    status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
    payment_method_id UUID REFERENCES payment_methods(id),
    external_id TEXT, -- Stripe payment intent ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'payment', 'invite', 'reminder', etc.
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_id UUID, -- Can be a group_id, subscription_id, etc.
    related_entity_type TEXT, -- 'group', 'subscription', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Groups policies
CREATE POLICY "Anyone can create groups"
    ON groups FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Group members can view groups"
    ON groups FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Group admins can update groups"
    ON groups FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- Group members policies
CREATE POLICY "Anyone can join groups"
    ON group_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view groups they are members of"
    ON group_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members gm
            WHERE gm.group_id = group_id
            AND gm.user_id = auth.uid()
        )
    );

-- Payment methods policies
CREATE POLICY "Users can manage their own payment methods"
    ON payment_methods FOR ALL
    USING (user_id = auth.uid());

-- Virtual cards policies
CREATE POLICY "Group members can view virtual cards"
    ON virtual_cards FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = group_id
            AND group_members.user_id = auth.uid()
        )
    );

-- Subscriptions policies
CREATE POLICY "Group members can view subscriptions"
    ON subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = group_id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Group admins can manage subscriptions"
    ON subscriptions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = group_id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- Subscription shares policies
CREATE POLICY "Users can view their subscription shares"
    ON subscription_shares FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM subscriptions s
            JOIN group_members gm ON s.group_id = gm.group_id
            WHERE s.id = subscription_id
            AND gm.user_id = auth.uid()
        )
    );

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM subscriptions s
            JOIN group_members gm ON s.group_id = gm.group_id
            WHERE s.id = subscription_id
            AND gm.user_id = auth.uid()
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid()); 