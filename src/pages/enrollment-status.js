import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Stack,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Logout = () => (
  <Button
    variant="outline"
    colorScheme="blue"
    onClick={() => {
      signOut({ redirect: false });
    }}
  >
    Logout
  </Button>
);

const info = {
  PENDING: {
    image: "/process.gif",
    status: "info",
    title: "Your enrollment is being processed by the institution.",
    desc: "You'll be able to login soon 🙂",
    action: <Logout />,
  },
  APPROVED: {
    image: null,
    status: "success",
    title: "Your request to join was approved.",
    desc: "You can explore the communities",
    action: (
      <Link href="/community/discover">
        <Button variant="outline" colorScheme="purple">
          Go to Discover screen
        </Button>
      </Link>
    ),
  },
  REJECTED: {
    image: null,
    status: "error",
    title: "Your request to join was rejected.",
    desc: "Please contact the admins of the institution",
    action: <Logout />,
  },
};

const EnrollmentStatus = () => {
  const {
    data: { user },
  } = useSession();

  const content = info[user.enrollmentStatus];

  return (
    <Stack h="100dvh" alignItems="center" justifyContent="center">
      {content.image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.image} alt="Being processed" className="w-48" />
        </>
      )}
      <Alert
        minW="sm"
        maxWidth="fit-content"
        rounded="2xl"
        status={content.status}
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minH="2xs"
        mb={3}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {content.title}
        </AlertTitle>
        <AlertDescription maxWidth="sm">{content.desc}</AlertDescription>
      </Alert>
      {content.action}
    </Stack>
  );
};

EnrollmentStatus.withAuth = true;

export default EnrollmentStatus;
