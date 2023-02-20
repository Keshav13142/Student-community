import { Container, SkeletonText } from "@chakra-ui/react";

const LoadingSkeleton = ({ count }) => {
  return (
    <>
      {[...new Array(count)].map((_, i) => (
        <Container key={i} padding="5" bg="gray.200" rounded="xl">
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="2" />
        </Container>
      ))}{" "}
    </>
  );
};

export default LoadingSkeleton;
