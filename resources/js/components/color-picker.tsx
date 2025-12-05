import * as React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface ColorPickerProps extends UseControllerProps<any> {
    label: string;
}

export function ColorPicker({ label, control, name }: ColorPickerProps) {
    const {
        field: { value, onChange },
    } = useController({ control, name });

    const [open, setOpen] = React.useState(false);

    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        style={{ backgroundColor: value || "#ffffff" }}
                    >
                        {value || "انتخاب رنگ"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <HexColorPicker color={value || "#ffffff"} onChange={onChange} />
                    <div className="mt-2">
                        <HexColorInput
                            color={value || "#ffffff"}
                            onChange={onChange}
                            className="w-full border p-1 rounded"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
