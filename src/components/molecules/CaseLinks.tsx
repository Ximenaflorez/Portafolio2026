import { AppWindow, FolderGit2 } from "lucide-react";
import { Button } from "../atoms/Button";

type Link = { href: string; label: string };

const icon = "h-4 w-4 shrink-0";

/** Pantalla publicada y repositorio del caso. La pantalla lleva una ventana; el repo, una carpeta git. */
export function CaseLinks({
  screen,
  spec,
  className = "mt-4 flex flex-col gap-2 sm:flex-row",
}: {
  screen?: Link;
  spec?: Link;
  className?: string;
}) {
  if (!screen && !spec) return null;
  return (
    <div className={className}>
      {screen ? (
        <Button variant="primary" href={screen.href} newTab>
          <AppWindow aria-hidden focusable="false" className={icon} />
          {screen.label}
        </Button>
      ) : null}
      {spec ? (
        <Button variant="secondary" href={spec.href} newTab>
          <FolderGit2 aria-hidden focusable="false" className={icon} />
          {spec.label}
        </Button>
      ) : null}
    </div>
  );
}
