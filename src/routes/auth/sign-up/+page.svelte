<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { signUpEmailAndPassword, auth, getUser } from "$lib/api/firebase";
	import LoginIcon from "$lib/components/icons/LoginIcon.svelte";
	import { onMount } from "svelte";
	import { updateProfile } from "firebase/auth";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";

	let name = "";
	let email = "";
	let password = "";

	const onSubmit = () => {
		const address_line = document.getElementById("address-text") as HTMLInputElement;
		let address = {
			street_number: address_line.value.split(" ")[0],
			street_name: address_line.value.split(" ").slice(1).join(" "),
			city: (document.getElementById("city-text") as HTMLInputElement).value,
			state: (document.getElementById("state-text") as HTMLInputElement).value,
			zip: (document.getElementById("zip-code-text") as HTMLInputElement).value,
		};

		if (
			address.street_number == "" ||
			address.street_name == "" ||
			address.city == "" ||
			address.state == "" ||
			address.zip == ""
		) {
			toast("Please fill out all fields.");
			return;
		}

		if (address.zip.length != 5) {
			toast("Please enter a valid zip code.");
			return;
		}

		if (address.state.length != 2) {
			toast("Please enter state initials (ex: MI).");
			return;
		}

		const first_name = (document.getElementById("first-name-text") as HTMLInputElement).value;
		const last_name = (document.getElementById("last-name-text") as HTMLInputElement).value;

		if (first_name == "" || last_name == "") {
			toast("Please enter your first and last name.");
			return;
		}

		signUpEmailAndPassword(email, password)
			.then(async e => {
				await updateProfile(e.user, {
					displayName: `${name}`,
				});

				const usr = await getUser();

				await fetch("/api/v1/user", {
					method: "POST",
					headers: {
						auth_token: usr.uid,
					},
					body: JSON.stringify({
						first_name: first_name,
						last_name: last_name,
						email: email,
						address: address,
					}),
				}).catch(e => {
					toast(`${e.name}: ${e.code}`);
				});

				goto("/home");
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
		// @ts-ignore
		const em = document.getElementById("content-1").querySelector("input") as HTMLInputElement;

		if (em.value == "") {
			toast("Please enter an email address.");
			return;
		}

		if (!em.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			toast("Please enter a valid email address.");
			return;
		}

		email = em.value;

		console.log(1);
		document.getElementById("content-" + currentContent + "-container")?.style.setProperty("--left", "-100vw");
		document.getElementById("content-" + (currentContent + 1) + "-container")?.style.setProperty("--left", "-100vw");
		currentContent++;
		updateSpacing();
	}

	function finalContent() {
		const first = document.getElementById("first-content") as HTMLDivElement;
		const second = document.getElementById("final-content") as HTMLDivElement;

		// @ts-ignore
		const pws = document.getElementById("content-2").querySelectorAll("input") as NodeListOf<HTMLInputElement>;

		if (pws[0].value == "") {
			toast("Please enter a password.");
			return;
		}

		if (pws[1].value == "") {
			toast("Please confirm your password.");
			return;
		}

		if (pws[0].value != pws[1].value) {
			toast("Passwords do not match.");
			return;
		}

		if (pws[0].value.length < 6) {
			toast("Password must be at least 6 characters long.");
			return;
		}

		password = pws[0].value;

		first.style.left = "-100vw";
		second.style.left = "50vw";
	}
</script>

<div class="overflow-x-hidden fixed inset-0">
	<div
		class="absolute inset-0 -z-30"
		style="background-size: 70px 70px;background-image:linear-gradient(to right, #1E2027 1px, transparent 1px),linear-gradient(to bottom, #1E2027 1px, transparent 1px);"
	></div>
	<div
		class="fixed inset-0 -z-40"
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
				<Button variant="fancy" on:click={nextContent}>
					<LoginIcon size={20} color="#66A3EB" class="mr-1" />
					Sign Up
				</Button>
			</div>
			<Separator class="opacity-0 mt-3" />
			<p class="text-muted-foreground text-xs text-center opacity-0 pointer-events-none">
				Already have an account? Log in instead.
			</p>
		</div>

		<div
			id="content-2-container"
			class="flex flex-col gap-2 w-[80vw] absolute top-1/2 -translate-y-1/2 left-[calc(100vw+var(--left))] transition-all"
		>
			<h1 class="text-3xl text-center opacity-0 pointer-events-none">Create Your Account</h1>
			<div id="content-2" class="flex flex-col gap-2">
				<Input placeholder="Password" type="password" />
				<Input placeholder="Confirm Password" type="password" />
				<Button variant="fancy" on:click={finalContent}>
					<ArrowIcon size={20} color="#66A3EB" class="mr-1" />
					Sign Up
				</Button>
			</div>
			<Separator class="opacity-0 mt-3 pointer-events-none" />
			<p class="text-muted-foreground text-xs text-center opacity-0 pointer-events-none">
				Already have an account? Log in instead.
			</p>
		</div>

		<Separator />
		<p class="text-muted-foreground text-xs text-center">
			Already have an account? <a
				href="/auth/sign-in"
				class="cursor-pointer text-primary-foreground hover:underline absolute z-10">Log in</a
			>Log in instead.
		</p>
	</div>

	<div
		class="absolute top-1/2 left-[150vw] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 w-[80vw] transition-all"
		id="final-content"
	>
		<h2 class="text-2xl text-center">We need some info from you before you begin...</h2>
		<div class="flex flex-row gap-3">
			<Input id="first-name-text" placeholder="First Name" />
			<Input id="last-name-text" placeholder="Last Name" />
		</div>
		<Input id="address-text" placeholder="Address" />
		<div class="flex flex-row gap-3">
			<Input id="country-text" placeholder="Country" />
			<Input id="state-text" placeholder="State" />
		</div>
		<div class="flex flex-row gap-3">
			<Input id="city-text" placeholder="City" />
			<Input id="zip-code-text" placeholder="Zip Code" />
		</div>
		<Button variant="fancy" on:click={onSubmit}>Get Started</Button>
	</div>
</div>
