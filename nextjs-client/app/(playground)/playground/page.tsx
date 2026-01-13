'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateInput } from '@/components/common';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function PlaygroundPage() {
    const { toast } = useToast();
    const [date, setDate] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="space-y-12 pb-20 p-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Component Playground</h1>
                <p className="text-muted-foreground">
                    A test page for verifying component functionality and styling.
                </p>
            </div>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Atoms</h2>
                    <Badge variant="outline">Basic Building Blocks</Badge>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="outline">Outline</Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Avatars</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Status & Skeleton</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Form Elements</h2>
                    <Badge variant="secondary">Inputs & Controls</Badge>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Text Inputs</CardTitle>
                            <CardDescription>Various input states</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" placeholder="Email" />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="disabled">Disabled</Label>
                                <Input disabled type="email" id="disabled" placeholder="Disabled" />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="message">Message</Label>
                                <Textarea placeholder="Type your message here." id="message" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Selection Controls</CardTitle>
                            <CardDescription>Select, Checkbox, Switch</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms">Accept terms and conditions</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="airplane-mode" />
                                <Label htmlFor="airplane-mode">Airplane Mode</Label>
                            </div>

                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Date & Time 예제</CardTitle>
                            <CardDescription>Using DateInput</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label>보이기 선택</Label>
                                    <DateInput
                                        value={date}
                                        onChange={setDate}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Selected: {date}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label>보이기 입력</Label>
                                    <DateInput
                                        value={date}
                                        onChange={setDate}
                                        placeholder="YYYY-MM-DD"
                                        variant="input"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Selected: {date}</p>
                            </div>


                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Feedback & Overlay</h2>
                    <Badge variant="destructive">Interaction</Badge>
                </div>
                <Separator />

                <div className="flex flex-wrap gap-6">
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Toast</CardTitle>
                            <CardDescription>Notification messages</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    toast({
                                        title: "Scheduled: Catch up",
                                        description: "Friday, February 10, 2023 at 5:57 PM",
                                    });
                                }}
                            >
                                Show Toast
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Something went wrong.",
                                        description: "There was a problem with your request.",
                                    });
                                }}
                            >
                                Show Error Toast
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Dialog</CardTitle>
                            <CardDescription>Controlled Component Pattern</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={() => setIsDialogOpen(false)}>Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Tooltip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="w-full">Hover Me</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add to library</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
