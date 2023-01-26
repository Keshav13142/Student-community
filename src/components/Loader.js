import Lottie from "react-lottie";
import animationData from "../lotties/loading.json";

export default function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Lottie options={defaultOptions} height={300} width={300} />
    </div>
  );
}
