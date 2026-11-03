import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Tailwind,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  email: string;
  resetUrl: string;
}

const ResetPasswordEmail = ({ email, resetUrl }: ResetPasswordEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-[16px] mt-0">
                Reset your password
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
                We received a request to reset the password for {email}. Click
                the button below to choose a new one.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] mt-0 leading-[20px]">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
                <br />
                {resetUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 m-0 leading-[20px]">
                This link expires in 1 hour. If you didn&apos;t request a
                password reset, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
