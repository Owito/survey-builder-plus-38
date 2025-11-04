-- Create profiles table to store user roles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create surveys table
CREATE TABLE public.surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on surveys
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Surveys policies
CREATE POLICY "Anyone can view published surveys"
  ON public.surveys FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create surveys"
  ON public.surveys FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own surveys"
  ON public.surveys FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own surveys"
  ON public.surveys FOR DELETE
  USING (auth.uid() = created_by);

-- Create questions table
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('text', 'multiple', 'scale')),
  options text[],
  order_number integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions policies
CREATE POLICY "Anyone can view questions of published surveys"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = questions.survey_id 
      AND (surveys.is_published = true OR surveys.created_by = auth.uid())
    )
  );

CREATE POLICY "Survey creators can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.created_by = auth.uid()
    )
  );

CREATE POLICY "Survey creators can update questions"
  ON public.questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.created_by = auth.uid()
    )
  );

CREATE POLICY "Survey creators can delete questions"
  ON public.questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.created_by = auth.uid()
    )
  );

-- Create responses table
CREATE TABLE public.responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  answer_text text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on responses
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Responses policies
CREATE POLICY "Users can view their own responses"
  ON public.responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Survey creators can view all responses to their surveys"
  ON public.responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = responses.survey_id 
      AND surveys.created_by = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert responses"
  ON public.responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to update updated_at on surveys
CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON public.surveys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();