import json
import re


def strip_code_fences(text: str) -> str:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def extract_first_balanced_json(text: str) -> str | None:
    start_index = None
    stack: list[str] = []
    in_string = False
    escape = False

    for index, character in enumerate(text):
        if escape:
            escape = False
            continue

        if character == "\\" and in_string:
            escape = True
            continue

        if character == '"':
            in_string = not in_string
            continue

        if in_string:
            continue

        if character in "{[":
            if start_index is None:
                start_index = index
            stack.append(character)
        elif character in "}]":
            if not stack:
                continue
            opening = stack.pop()
            if (opening, character) not in {("{", "}"), ("[", "]")}:
                continue
            if not stack and start_index is not None:
                return text[start_index : index + 1]
    return None


def parse_json_from_text(text: str) -> dict | list:
    """Parse a model response that may contain JSON plus wrapper text."""
    cleaned = strip_code_fences(text)

    for candidate in (cleaned, extract_first_balanced_json(cleaned)):
        if not candidate:
            continue
        return json.loads(candidate)

    raise ValueError("No valid JSON object or array could be extracted from model output.")
