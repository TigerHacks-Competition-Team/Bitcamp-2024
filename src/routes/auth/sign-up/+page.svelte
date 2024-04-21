<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { signUpEmailAndPassword, auth } from "$lib/api/firebase";
	import { updateProfile } from "firebase/auth";
	import { toast } from "svelte-sonner";
	import LoginIcon from "$lib/components/icons/LoginIcon.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import { onMount } from "svelte";

	let name = "";
	let email = "";
	let password = "";

	const onSubmit = () => {
		signUpEmailAndPassword(email, password)
			.then(async e => {
				await updateProfile(e.user, {
					displayName: `${name}`,
				});

				if (!auth.currentUser) return;
				await fetch("/api/v1/user", {
					method: "POST",
					headers: {
						auth_token: auth.currentUser.uid,
					},
					body: JSON.stringify({
						first_name: "John",
						last_name: "Doe",
						address: {
							street_number: "123",
							street_name: "Main St",
							city: "Springfield",
							state: "IL",
							zip: "62701",
						},
					}),
				});
			})
			.catch(e => {
				toast(`${e.name}: ${e.code}`);
			});
	};

	let currentContent = 1;
	function updateSpacing() {
		const spacing = document.getElementById("spacing-div");
		const content = document.getElementById(`content-${currentContent}`);
		console.log(content?.offsetHeight);
		// @ts-ignore
		spacing.style.height = content?.offsetHeight + "px";
	}
	onMount(updateSpacing);

	function nextContent() {
		console.log(1);
		document.getElementById("content-" + currentContent + "-container")?.style.setProperty("--left", "-100vw");
		document.getElementById("content-" + (currentContent + 1) + "-container")?.style.setProperty("--left", "-100vw");
		currentContent++;
		updateSpacing();
	}

	function finalContent() {
		const first = document.getElementById("first-content") as HTMLDivElement;
		const second = document.getElementById("final-content") as HTMLDivElement;
		first.style.left = "-100vw";
		second.style.left = "50vw";
	}
</script>

<div class="overflow-x-hidden">
	<div
		class="fixed inset-0"
		style="background: radial-gradient(57.01% 13.63% at 50% 0%, #111E2D 0%, #17181D 100%), #17181D"
	></div>

	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 w-[80vw] transition-all"
		style="--left:0px"
		id="first-content"
	>
		<h1 class="text-3xl text-center">Create Your Account</h1>
		<div id="spacing-div" class="transition-all" />

		<div
			id="content-1-container"
			class="flex flex-col gap-2 w-[80vw] absolute top-1/2 -translate-y-1/2 left-[var(--left)] transition-all"
		>
			<h1 class="text-3xl text-center opacity-0">Create Your Account</h1>
			<div id="content-1" class="flex flex-col gap-2">
				<Input placeholder="Email Address" />
				<FancyButton text="Sign Up" icon="login" on:click={nextContent} />
			</div>
			<Separator class="opacity-0 mt-3" />
			<p class="text-muted-foreground text-xs text-center opacity-0">Already have an account? Log in instead.</p>
		</div>

		<div
			id="content-2-container"
			class="flex flex-col gap-2 w-[80vw] absolute top-1/2 -translate-y-1/2 left-[calc(100vw+var(--left))] transition-all"
		>
			<h1 class="text-3xl text-center opacity-0">Create Your Account</h1>
			<div id="content-2" class="flex flex-col gap-2">
				<Input placeholder="Password" />
				<Input placeholder="Confirm Password" />
				<FancyButton text="Next" icon="arrow" on:click={finalContent}/>
			</div>
			<Separator class="opacity-0 mt-3" />
			<p class="text-muted-foreground text-xs text-center opacity-0">Already have an account? Log in instead.</p>
		</div>

		<Separator />
		<p class="text-muted-foreground text-xs text-center">Already have an account? Log in instead.</p>
	</div>

	<div class="absolute top-1/2 left-[150vw] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 w-[80vw] transition-all" id="final-content">
		<h2 class="text-2xl text-center">We need some info from you before you begin...</h2>
		<div class="flex flex-row gap-3">
			<Input placeholder="First Name" />
			<Input placeholder="Last Name" />
		</div>
		<Input placeholder="Address" />
		<div class="flex flex-row gap-3">
			<Input placeholder="Country" />
			<Input placeholder="State" />
		</div>
		<div class="flex flex-row gap-3">
			<Input placeholder="City" />
			<Input placeholder="Zip Code" />
		</div>
		<FancyButton text="Get Started" icon="none" />
	</div>

	<!-- <form on:submit|preventDefault={onSubmit}>
		<div>
			<div>
                <div>
                    <Label for="email">Name</Label>
					<Input
						id="email"
						placeholder="John Appleseed"
						autocapitalize="none"
						autocorrect="off"
						bind:value={name}
					/>
                </div>
				<div>
					<Label for="email">Email</Label>
					<Input
						id="email"
						placeholder="johnny@appleseed.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						bind:value={email}
					/>
				</div>
				<div>
					<Label for="password">Password</Label>
					<Input
						id="password"
						placeholder=""
						type="password"
						autocapitalize="none"
						autocomplete="password"
						autocorrect="off"
						bind:value={password}
					/>
				</div>
				<Button type="submit">Sign up</Button>
			</div>
		</div>
	</form>
	<a href="/">Back</a> -->
</div>
