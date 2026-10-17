import { redirect } from "next/navigation";

/** The project archive now lives on the home page as the zoomed Projects tile. */
export default function ProjectsPage() {
  redirect("/#projects");
}
