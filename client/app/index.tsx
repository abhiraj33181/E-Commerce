import { Redirect } from "expo-router";
import { useAuth } from "@/context/authContext";
import Loading from "@/components/Loading";

export default function index() {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Redirect href={"/(tabs)"} />;
  }
  return <Redirect href={"/onboarding" as any} />;
}
