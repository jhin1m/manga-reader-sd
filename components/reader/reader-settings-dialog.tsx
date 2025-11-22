"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { FileText, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReaderSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readingMode: "single" | "long-strip";
  onReadingModeChange: (mode: "single" | "long-strip") => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  readingDirection?: "ltr" | "rtl";
  onReadingDirectionChange?: (direction: "ltr" | "rtl") => void;
}

export function ReaderSettingsDialog({
  open,
  onOpenChange,
  readingMode,
  onReadingModeChange,
  zoom,
  onZoomChange,
  readingDirection = "ltr",
  onReadingDirectionChange,
}: ReaderSettingsDialogProps) {
  const t = useTranslations("reader.settings");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reading Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("readingMode.label")}
            </Label>
            <RadioGroup
              value={readingMode}
              onValueChange={(value) =>
                onReadingModeChange(value as "single" | "long-strip")
              }
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="single"
                  id="single"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="single"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <FileText className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">
                    {t("readingMode.single")}
                  </span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    {t("readingMode.singleDesc")}
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="long-strip"
                  id="long-strip"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="long-strip"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <ScrollText className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">
                    {t("readingMode.longStrip")}
                  </span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    {t("readingMode.longStripDesc")}
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reading Direction */}
          {onReadingDirectionChange && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t("readingDirection.label")}
              </Label>
              <RadioGroup
                value={readingDirection}
                onValueChange={(value) =>
                  onReadingDirectionChange(value as "ltr" | "rtl")
                }
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="ltr"
                    id="ltr"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="ltr"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-sm font-medium">
                      {t("readingDirection.ltr")}
                    </span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      {t("readingDirection.ltrDesc")}
                    </span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="rtl"
                    id="rtl"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="rtl"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-sm font-medium">
                      {t("readingDirection.rtl")}
                    </span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      {t("readingDirection.rtlDesc")}
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Zoom Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {t("zoom.label")}
              </Label>
              <span className="text-sm text-muted-foreground">{zoom}%</span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => onZoomChange(value[0])}
              min={50}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
