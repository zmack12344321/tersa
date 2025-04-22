import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

const title = 'Create an account';
const description = 'Enter your details to get started.';

export const metadata: Metadata = {
  title,
  description,
};

const SignUpPage = () => <SignUp waitlistUrl="/" signInUrl="/sign-in" />;

export default SignUpPage;
