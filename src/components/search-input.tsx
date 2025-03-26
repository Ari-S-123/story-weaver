"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { useSearchParam } from "@/hooks/use-search-param";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setSearch] = useSearchParam("search");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    setSearch("");
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(value);
    inputRef.current?.blur();
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="relative max-w-[720px] w-full">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder="Search stories by title..."
          className="md:text-base placeholder:text-neutral-500 dark:placeholder:text-neutral-400 px-14 w-full border-none focus-visible:shadow=[0_1px_1px_0_rgba(65, 69, 73, 0.3),0_1px_3px_1px_rgba(65, 69, 73, 0.15)] dark:focus-visible:shadow=[0_1px_1px_0_rgba(0, 0, 0, 0.5),0_1px_3px_1px_rgba(0, 0, 0, 0.3)] rounded-full h-[48px] focus-visible:ring-0 focus:bg-neutral-100 dark:focus:bg-neutral-800"
        />
        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <SearchIcon className="w-4 h-4" />
        </Button>
        {value && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
            onClick={handleClear}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
