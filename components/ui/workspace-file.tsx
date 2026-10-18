import type { ReactNode } from "react";

/** A file in the same workspace, rather than a separate terminal window. */
export function WorkspaceFile({
  id,
  title,
  filename,
  type = "MD",
  action,
  children,
}: {
  id: string;
  title: string;
  filename: string;
  type?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} tabIndex={-1} className="workspace-section workspace-file" aria-labelledby={`${id}-heading`}>
      <header className="workspace-file-header">
        <span aria-hidden="true" className="text-brand">{type}</span>
        <h2 id={`${id}-heading`}>{title}</h2>
        <span className="workspace-file-path">{filename}</span>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </header>
      <div className="workspace-file-body">{children}</div>
    </section>
  );
}
