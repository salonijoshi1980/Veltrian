'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@lshay/ui/components/default/accordion';

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@lshay/ui/components/default/alert';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@lshay/ui/components/default/alert-dialog';

import { AspectRatio } from '@lshay/ui/components/default/aspect-ratio';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@lshay/ui/components/default/avatar';

import { Badge } from '@lshay/ui/components/default/badge';

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@lshay/ui/components/default/breadcrumb';

import { Button } from '@lshay/ui/components/default/button';

import { Calendar } from '@lshay/ui/components/default/calendar';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@lshay/ui/components/default/card';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@lshay/ui/components/default/carousel';

import { Checkbox } from '@lshay/ui/components/default/checkbox';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@lshay/ui/components/default/collapsible';

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@lshay/ui/components/default/command';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from '@lshay/ui/components/default/dialog';

import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@lshay/ui/components/default/context-menu';

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
} from '@lshay/ui/components/default/drawer';

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@lshay/ui/components/default/dropdown-menu';

import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@lshay/ui/components/default/hover-card';

import { Input } from '@lshay/ui/components/default/input';

import { Label } from '@lshay/ui/components/default/label';

import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarPortal,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '@lshay/ui/components/default/menubar';

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from '@lshay/ui/components/default/navigation-menu';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@lshay/ui/components/default/pagination';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@lshay/ui/components/default/popover';

import { Progress } from '@lshay/ui/components/default/progress';

import {
	RadioGroup,
	RadioGroupItem,
} from '@lshay/ui/components/default/radio-group';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@lshay/ui/components/default/resizable';

import {
	ScrollArea,
	ScrollBar,
} from '@lshay/ui/components/default/scroll-area';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@lshay/ui/components/default/select';

import { Separator } from '@lshay/ui/components/default/separator';

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetOverlay,
	SheetPortal,
	SheetTitle,
	SheetTrigger,
} from '@lshay/ui/components/default/sheet';

import { Skeleton } from '@lshay/ui/components/default/skeleton';

import { Slider } from '@lshay/ui/components/default/slider';

import { Switch } from '@lshay/ui/components/default/switch';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@lshay/ui/components/default/table';

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@lshay/ui/components/default/tabs';

import { Textarea } from '@lshay/ui/components/default/textarea';

import {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@lshay/ui/components/default/toast';
import { Toaster } from '@lshay/ui/components/default/toaster';
import { useToast } from '@lshay/ui/components/default/use-toast';

import { Toggle } from '@lshay/ui/components/default/toggle';

import {
	ToggleGroup,
	ToggleGroupItem,
} from '@lshay/ui/components/default/toggle-group';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@lshay/ui/components/default/tooltip';

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@lshay/ui/components/default/input-otp';
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDown } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

function CustomAccordion({ data, type, className }) {
	return (
		<Accordion type={type} collapsible className={className}>
			{data.map((item) => (
				<AccordionItem key={item.value} value={item.value}>
					<AccordionTrigger>{item.trigger}</AccordionTrigger>
					<AccordionContent>{item.content}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}

function CustomAlert({ variant, icon, title, description }) {
	return (
		<Alert variant={variant}>
			{icon}
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}

function CustomAlertDialog({
	title,
	description,
	triggerLabel,
	cancelLabel = 'Cancel',
	actionLabel,
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">{triggerLabel}</Button>
			</AlertDialogTrigger>
			<AlertDialogPortal>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
						<AlertDialogAction>{actionLabel}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogPortal>
		</AlertDialog>
	);
}

function CustomAvatar({ src, alt, fallbackLabel }) {
	return (
		<Avatar>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback>{fallbackLabel}</AvatarFallback>
		</Avatar>
	);
}

function CustomBreadcrumb({
	homeLink,
	dropdownMenuItems,
	componentLink,
	componentName,
}) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href={homeLink}>Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-1">
							<BreadcrumbEllipsis className="h-4 w-4" />
							<span className="sr-only">Toggle menu</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{dropdownMenuItems.map((item) => (
								<DropdownMenuItem key={item.label} onClick={item.onClick}>
									{item.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href={componentLink}>{componentName}</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{componentName}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function CustomCard({
	className,
	title,
	description,
	children,
	footerChildren,
}) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>
			{footerChildren && <CardFooter>{footerChildren}</CardFooter>}
		</Card>
	);
}

function CustomCarousel({ items }) {
	return (
		<Carousel
			opts={{
				align: 'start',
			}}
			className="mx-20 w-[calc(100%-160px)]"
		>
			<CarouselContent>
				{items.map((item) => (
					<CarouselItem
						className="md:basis-1/2 lg:basis-1/3"
						key={
							item.id ||
							`carousel-item-${Math.random().toString(36).substr(2, 9)}`
						}
					>
						{item.content}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

function CollapsibleSection({ title, nonCollapsedItems, collapsedItems }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-[350px] space-y-2"
		>
			<div className="flex items-center justify-between space-x-4 px-4">
				<h4 className="font-semibold text-sm">{title}</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm" className="w-9 p-0">
						<ChevronsUpDown className="h-4 w-4" />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			{nonCollapsedItems}
			<CollapsibleContent>{collapsedItems}</CollapsibleContent>
		</Collapsible>
	);
}

function CommandPalette({
	asDialog = false,
	dialogTriggerKey = 'k',
	commandGroups,
}) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!asDialog) return;

		const down = (e) => {
			if (e.key === dialogTriggerKey && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((newOpen) => !newOpen);
			}
		};

		document.addEventListener('keydown', down);

		return () => {
			document.removeEventListener('keydown', down);
		};
	}, [asDialog, dialogTriggerKey]);

	const render = (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				{commandGroups.length === 0 && (
					<CommandEmpty>No results found.</CommandEmpty>
				)}
				{commandGroups.map((group) => (
					<Fragment key={group.heading}>
						<CommandGroup heading={group.heading}>
							{group.items.map((item) => (
								<CommandItem onSelect={item.onSelect} key={item.label}>
									<span>{item.label}</span>
									{item.shortcut && (
										<CommandShortcut>{item.shortcut}</CommandShortcut>
									)}
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator />
					</Fragment>
				))}
			</CommandList>
		</Command>
	);

	if (!asDialog) return render;

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			{render}
		</CommandDialog>
	);
}

function CustomContextMenu({ triggerLabel, items }) {
	const renderMenuItems = (menuItems) =>
		menuItems.map((item) => (
			<Fragment key={item.label}>
				{item.subItems ? (
					<ContextMenuSub>
						<ContextMenuSubTrigger>{item.label}</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuGroup>
								{renderMenuItems(item.subItems)}
							</ContextMenuGroup>
						</ContextMenuSubContent>
					</ContextMenuSub>
				) : (
					<ContextMenuItem
						onSelect={item.onSelect}
						key={item.label}
						disabled={item.disabled}
					>
						{item.label}
						{item.shortcut && (
							<ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
						)}
					</ContextMenuItem>
				)}
			</Fragment>
		));

	return (
		<ContextMenu>
			<ContextMenuTrigger className="h-full w-full">
				{triggerLabel}
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup>{renderMenuItems(items)}</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	);
}

function CustomDialog({
	triggerButtonText,
	title,
	description,
	children,
	footer,
	open,
	onOpenChange,
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline">{triggerButtonText}</Button>
			</DialogTrigger>
			<DialogPortal>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					{children}
					{footer && <DialogFooter>{footer}</DialogFooter>}
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}

function CustomDrawer({
	title,
	description,
	openButtonText = 'Open',
	children,
	footer,
}) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">{openButtonText}</Button>
			</DrawerTrigger>
			<DrawerPortal>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>{title}</DrawerTitle>
							<DrawerDescription>{description}</DrawerDescription>
						</DrawerHeader>
						<div className="p-4">{children}</div>
						{footer && <DrawerFooter>{footer}</DrawerFooter>}
					</div>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	);
}

function CustomDropdown({ triggerLabel, menuLabel, items }) {
	const renderMenuItems = (itemsToRender) =>
		itemsToRender.map((item) => (
			<Fragment key={item.label}>
				{item.subItems ? (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{item.content}
							<span>{item.label}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{renderMenuItems(item.subItems)}
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				) : (
					<DropdownMenuItem>
						{item.content}
						<span>{item.label}</span>
						{item.shortcut && (
							<DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
						)}
					</DropdownMenuItem>
				)}
			</Fragment>
		));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{triggerLabel}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				{menuLabel && <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>}
				<DropdownMenuSeparator />
				<DropdownMenuGroup>{renderMenuItems(items)}</DropdownMenuGroup>
				<DropdownMenuSeparator />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function CustomMenubar({ menuData }) {
	return (
		<Menubar>
			{menuData.map((menu) => (
				<MenubarMenu key={menu.trigger}>
					<MenubarTrigger>{menu.trigger}</MenubarTrigger>
					<MenubarContent>
						{menu.items.map((item) => {
							switch (item.type) {
								case 'separator':
									return <MenubarSeparator key={`separator-${item.type}`} />;
								case 'submenu':
									return (
										<MenubarSub key={item.label}>
											<MenubarSubTrigger>{item.label}</MenubarSubTrigger>
											<MenubarSubContent>
												{item.items.map(
													(subItem) =>
														subItem.type === 'item' && (
															<MenubarItem
																onSelect={subItem.onSelect}
																key={subItem.label}
																disabled={subItem.disabled}
															>
																{subItem.label}
																{subItem.shortcut && (
																	<MenubarShortcut>
																		{subItem.shortcut}
																	</MenubarShortcut>
																)}
															</MenubarItem>
														)
												)}
											</MenubarSubContent>
										</MenubarSub>
									);
								case 'item':
									return (
										<MenubarItem
											key={item.label}
											disabled={item.disabled}
											onSelect={item.onSelect}
										>
											{item.label}
											{item.shortcut && (
												<MenubarShortcut>{item.shortcut}</MenubarShortcut>
											)}
										</MenubarItem>
									);
								default:
									return null;
							}
						})}
					</MenubarContent>
				</MenubarMenu>
			))}
		</Menubar>
	);
}

function CustomHoverCard({ trigger, children }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
			<HoverCardContent className="w-80">{children}</HoverCardContent>
		</HoverCard>
	);
}

function CustomNavigation({ sections }) {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				{sections.map((section) => (
					<NavigationMenuItem key={section.trigger}>
						<NavigationMenuTrigger>{section.trigger}</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								{section.items.map((item) => (
									<li
										key={item.href}
										className={`row-span-${item.rowSpan ?? 1}`}
									>
										<NavigationMenuLink asChild>
											<a
												className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
												href={item.href}
											>
												{item.logo}
												<div className="font-medium text-sm leading-none">
													{item.title}
												</div>
												<p className="text-muted-foreground text-sm leading-tight" />
												<p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
													{item.description}
												</p>
											</a>
										</NavigationMenuLink>
									</li>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function CustomPagination({ currentPage, totalPages, onPageChange }) {
	const pageNumbers = [];

	// Determine the range of page numbers to display.
	let startPage = Math.max(1, currentPage - 2);
	let endPage = Math.min(totalPages, currentPage + 2);

	// Adjust the start and end pages
	// if near the beginning or end of totalPages.
	if (currentPage - 2 < 1) {
		endPage = Math.min(5, totalPages);
	}
	if (currentPage + 2 > totalPages) {
		startPage = Math.max(1, totalPages - 4);
	}

	for (let num = startPage; num <= endPage; num++) {
		pageNumbers.push(num);
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						size={'default'}
						href="#"
						onClick={(e) => {
							e.preventDefault();
							onPageChange(Math.max(1, currentPage - 1));
						}}
					/>
				</PaginationItem>

				{/* Display ellipsis if there are pages 
            before the first visible page */}
				{startPage > 1 && (
					<>
						<PaginationItem>
							<PaginationLink
								size={'default'}
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPageChange(1);
								}}
							>
								1
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					</>
				)}

				{pageNumbers.map((page) => (
					<PaginationItem key={page}>
						{page === currentPage ? (
							<PaginationLink size={'default'} href="#" isActive>
								{page}
							</PaginationLink>
						) : (
							<PaginationLink
								size={'default'}
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPageChange(page);
								}}
							>
								{page}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				{/* Display ellipsis if there are pages
            after the last visible page */}
				{endPage < totalPages && (
					<>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink
								size={'default'}
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPageChange(totalPages);
								}}
							>
								{totalPages}
							</PaginationLink>
						</PaginationItem>
					</>
				)}

				<PaginationItem>
					<PaginationNext
						size={'default'}
						href="#"
						onClick={(e) => {
							e.preventDefault();
							onPageChange(Math.min(totalPages, currentPage + 1));
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

function CustomPopover({ triggerLabel = 'Open', children }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">{triggerLabel}</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">{children}</PopoverContent>
		</Popover>
	);
}

function CustomSelect({ placeholder, label, value, onValueChange, groups }) {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectScrollUpButton>
					<ChevronUpIcon />
				</SelectScrollUpButton>

				{groups.map((group) => (
					<Fragment key={group.groupName || 'default-group'}>
						<SelectGroup>
							{group.groupName && <SelectLabel>{group.groupName}</SelectLabel>}
							{group.items.map((item) => (
								<SelectItem
									key={item.value}
									value={item.value}
									disabled={item.disabled}
								>
									{item.label}
								</SelectItem>
							))}
						</SelectGroup>
						<SelectSeparator />
					</Fragment>
				))}

				<SelectScrollDownButton>
					<ChevronDownIcon />
				</SelectScrollDownButton>
			</SelectContent>
		</Select>
	);
}

function CustomSheet({
	title,
	description,
	buttonLabel,
	children,
	footer,
	open,
	onOpenChange,
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger asChild>
				<Button variant="outline">{buttonLabel}</Button>
			</SheetTrigger>
			<SheetPortal>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<SheetDescription>{description}</SheetDescription>
					</SheetHeader>
					{children}
					<SheetFooter>{footer}</SheetFooter>
				</SheetContent>
			</SheetPortal>
		</Sheet>
	);
}

function CustomTabs({ tabs, className, defaultValue }) {
	return (
		<Tabs defaultValue={defaultValue || tabs[0]?.value} className={className}>
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}

function CustomTooltip({
	children,
	content,
	defaultOpen,
	open,
	onOpenChange,
	delayDuration,
}) {
	return (
		<TooltipProvider>
			<Tooltip
				defaultOpen={defaultOpen}
				open={open}
				onOpenChange={onOpenChange}
				delayDuration={delayDuration}
			>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export {
	CustomAccordion,
	CustomAlert,
	CustomAlertDialog,
	CustomAvatar,
	CustomBreadcrumb,
	CustomCard,
	CustomCarousel,
	CollapsibleSection,
	CommandPalette,
	CustomContextMenu,
	CustomDialog,
	CustomDrawer,
	CustomDropdown,
	CustomMenubar,
	CustomHoverCard,
	CustomNavigation,
	CustomPagination,
	CustomPopover,
	CustomSelect,
	CustomSheet,
	CustomTabs,
	CustomTooltip,
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Alert,
	AlertDescription,
	AlertTitle,
	AlertDialog,
	AlertDialogTitle,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogPortal,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogDescription,
	AspectRatio,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
	Button,
	Calendar,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Checkbox,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandDialog,
	CommandShortcut,
	ContextMenu,
	ContextMenuSub,
	ContextMenuItem,
	ContextMenuGroup,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuContent,
	ContextMenuTrigger,
	ContextMenuShortcut,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuRadioGroup,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuCheckboxItem,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
	DialogPortal,
	DialogOverlay,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DrawerPortal,
	DrawerOverlay,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuShortcut,
	DropdownMenuRadioItem,
	DropdownMenuRadioGroup,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuCheckboxItem,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Input,
	Label,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
	MenubarSub,
	MenubarGroup,
	MenubarLabel,
	MenubarPortal,
	MenubarRadioItem,
	MenubarRadioGroup,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarCheckboxItem,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	RadioGroup,
	RadioGroupItem,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	ScrollArea,
	ScrollBar,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectScrollUpButton,
	SelectGroup,
	SelectLabel,
	SelectSeparator,
	SelectScrollDownButton,
	Separator,
	Sheet,
	SheetClose,
	SheetTitle,
	SheetFooter,
	SheetHeader,
	SheetPortal,
	SheetContent,
	SheetOverlay,
	SheetTrigger,
	SheetDescription,
	Skeleton,
	Slider,
	Switch,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableFooter,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Toast,
	ToastClose,
	ToastTitle,
	ToastAction,
	ToastProvider,
	ToastViewport,
	ToastDescription,
	useToast,
	Toaster,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
};
