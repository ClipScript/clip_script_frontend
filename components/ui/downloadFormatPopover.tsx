import * as React from "react";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "./popover"
import { Button } from "@/components/ui/button";

export function DownloadFormatPopover({ onSelect }: { onSelect: (format: string) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0 m-0"><span className="sr-only">Download</span></Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
                <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => onSelect("txt")}>TXT</Button>
                    <Button variant="outline" onClick={() => onSelect("csv")}>CSV</Button>
                    <Button variant="outline" onClick={() => onSelect("json")}>JSON</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
