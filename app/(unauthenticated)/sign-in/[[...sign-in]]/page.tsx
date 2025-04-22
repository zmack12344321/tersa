import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

const title = 'Welcome back';
const description = 'Enter your details to sign in.';

export const metadata: Metadata = {
  title,
  description,
};

const SignInPage = () => (
  <SignIn waitlistUrl="/" signInUrl="/sign-in" signUpUrl="/sign-up" />
);

export default SignInPage;
