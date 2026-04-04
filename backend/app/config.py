from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    project_root: Path
    content_dir: Path
    frontend_dist_dir: Path

    @classmethod
    def from_root(cls, root: Path) -> "Settings":
        return cls(
            project_root=root,
            content_dir=root / "content",
            frontend_dist_dir=root.parent / "frontend" / "dist",
        )
