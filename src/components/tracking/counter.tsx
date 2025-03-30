"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PauseIcon, PlayIcon, StopCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

type TimeTrackerProps = {
  onSave?: (data: {
    activity: string;
    elapsed: number;
    description?: string;
    tags: string[];
  }) => void;
};

export function TimeTracker({ onSave }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activity, setActivity] = useState("Remote Work");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time as HH:MM:SS
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  }

  function handleStart() {
    return setIsRunning(true);
  }
  function handlePause() {
    return setIsRunning(false);
  }

  function handleStop() {
    setIsRunning(false);
    if (onSave) {
      onSave({
        activity,
        elapsed,
        description,
        tags,
      });
    }
    // Reset timer but keep other values for now
    setElapsed(0);
  }

  function handleAddTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2">
          <Select
            value={activity}
            onValueChange={setActivity}
            disabled={isRunning}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote Work">Remote Work</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isRunning}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold">
              {formatTime(elapsed)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              disabled={isRunning}
            />
            <Button
              variant="outline"
              onClick={handleAddTag}
              disabled={isRunning || !newTag.trim()}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                {!isRunning && (
                  <span
                    onClick={() => handleRemoveTag(tag)}
                    className="cursor-pointer ml-1"
                  >
                    ×
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between w-full">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700 flex-1 mr-2"
            >
              <PlayIcon className="mr-2 h-4 w-4" /> Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              className="flex-1 mr-2"
            >
              <PauseIcon className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}

          <Button
            onClick={handleStop}
            variant="destructive"
            disabled={elapsed === 0}
            className="flex-1"
          >
            <StopCircleIcon className="mr-2 h-4 w-4" /> Stop
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
