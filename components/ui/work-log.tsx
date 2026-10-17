"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BentoTile } from "@/components/ui/bento-tile";
import { TextFlip } from "@/components/ui/text-flip";

type Job = { company: string; role: string; period: string; description: string; tags: string[]; link: string };

/** A stable 7-character "commit hash" so server and client render the same label. */
function shortHash(text: string) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

/** Experience as `git log`: one commit checked out in full, the rest as one-liners; zoom shows every commit. */
export function WorkLog({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState(0);

  return (
    <BentoTile id="work" title="Work" filename="git log --oneline">
      <ol className="worklog">
        {jobs.map((job, index) => {
          const current = index === open;
          return (
            <li key={job.company} className="worklog-commit" data-open={current || undefined}>
              <button type="button" onClick={() => setOpen(index)} aria-expanded={current} className="worklog-head">
                <span className="worklog-hash">{shortHash(job.company + job.role)}</span>
                {index === 0 && <span className="worklog-ref">HEAD → main</span>}
                <span className="worklog-role">{job.role}</span>
                <span className="worklog-company">@ {job.company}</span>
                <span className="worklog-period">{job.period}</span>
              </button>
              <div className="worklog-body">
                <p className="workspace-description">{job.description}</p>
                {job.tags.length > 0 && (
                  <div className="worklog-tags flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => <Badge key={tag} variant="outline" className="workspace-tag"><TextFlip>{tag}</TextFlip></Badge>)}
                  </div>
                )}
                <a href={job.link} target="_blank" rel="noopener noreferrer" className="workspace-link">{job.company.toLowerCase()}<ArrowUpRight className="h-3 w-3" /></a>
              </div>
            </li>
          );
        })}
      </ol>
    </BentoTile>
  );
}
