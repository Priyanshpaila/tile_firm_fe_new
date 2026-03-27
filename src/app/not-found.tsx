import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <PageShell title="Page not found" description="The requested route does not exist in this starter."><Link href="/"><Button>Back to home</Button></Link></PageShell>;
}
