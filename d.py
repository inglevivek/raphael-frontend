import os

IGNORED_DIRS = {
    "venv", ".venv", "env", ".env",
    "node_modules",
    "__pycache__",
    "dist", "build",
    ".git",".history",
    ".next"
}

def generate_tree(start_path, output_file, prefix=""):
    try:
        entries = sorted(os.listdir(start_path))
    except PermissionError:
        return  # skip folders without read permission

    # remove ignored folders
    entries = [
        e for e in entries
        if e not in IGNORED_DIRS
    ]

    for index, entry in enumerate(entries):
        path = os.path.join(start_path, entry)

        connector = "└── " if index == len(entries) - 1 else "├── "
        output_file.write(prefix + connector + entry + "\n")

        if os.path.isdir(path):
            extension = "    " if index == len(entries) - 1 else "│   "
            generate_tree(path, output_file, prefix + extension)

def export_directory_structure(output_path="directory_structure.txt"):
    root_dir = os.getcwd()  # current directory
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"Directory structure for: {root_dir}\n\n")
        generate_tree(root_dir, f)
    print(f"Directory structure saved to: {output_path}")


if __name__ == "__main__":
    export_directory_structure()
