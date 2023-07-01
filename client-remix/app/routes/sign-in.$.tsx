import { SignIn } from "@clerk/remix"

export default function SignInRoute() {
  return (
    <div>
      <h1>Sign In route</h1>
      <SignIn routing={"path"} path={"/sign-in"} />
    </div>
  )
}
