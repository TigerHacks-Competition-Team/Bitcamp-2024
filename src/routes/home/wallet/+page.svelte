<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	// import CreditCard from '$lib/components/CreditCard.svelte';
	//@ts-ignore
	import CreditCard from "svelte-credit-cards";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { getUser } from "$lib/api/firebase";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

	const cards = [
		{
			number: "5413638888246748",
			name: "John Doe",
			expiry: "12/24",
			cvc: Math.round(10 ** 3 + Math.random() * 10 ** 2).toString(),
		},
		{
			number: "4576597203880936",
			name: "John Doe",
			expiry: "08/25",
			cvc: Math.round(10 ** 3 + Math.random() * 10 ** 2).toString(),
		},
	];

	const getData = async () => {
		const uid = (await getUser()).uid
		const cards = (await (await fetch(`/api/v1/user/${uid}/cards`)).json()).cards;
		return cards;
	}

	const onSubmitNewCard = async () => {
		// @ts-ignore
		const cardNumber = (document.getElementById("card-number-input") as HTMLInputElement).value;
		// @ts-ignore 
		const expiration = (document.getElementById("expiration-input") as HTMLInputElement).value;
		// @ts-ignore
		const cvc = (document.getElementById("cvc-input") as HTMLInputElement).value;

		// @ts-ignore
		const name = (document.getElementById("card-name") as HTMLInputElement).value;

		if(cardNumber.length !== 16 || expiration.length !== 5 || cvc.length !== 3 || name.length === 0) {
			toast("Invalid card details");
			return;
		}

		if(!expiration.match(/^(?:0[1-9]|1[0-2])\/(\d{2})$/g)) {
			toast("Invalid expiration date");
			return;
		}

		(document.getElementById("last-btn") as HTMLButtonElement).disabled = true;

		await fetch(`/api/v1/user/${(await getUser()).uid}/new_card`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				account_number: cardNumber,
				expiration: expiration,
				name: name
			}),
		});

		goto('/home').then(
            () => goto("/home/wallet")
        );
	}
</script>

<p class="text-primary-foreground mb-3">Wallet</p>
{#await getData()}	
	<h1 class="text-center">Loading Your wallet...</h1>
{:then cards}
	<div
		class="flex flex-col gap-4 mx-3 overflow-y-scroll pb-[150px]"
		style="scrollbar-width:none; -ms-overflow-style: none;"
	>
		{#each cards as card}
			<!-- <CreditCard /> -->
			<CreditCard number={card.account_number} name={card.name} expiry={card.expiration} cvc={Math.round(10 ** 3 + Math.random() * 10 ** 2).toString()} />
		{/each}
		<Dialog.Root>
			<Dialog.Trigger>
				<Button variant="fancy">Add Card</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title class="mb-2">Add a Credit Card</Dialog.Title>
					<div class="flex flex-col gap-2">
						<Input id="card-number-input" placeholder="Card Number" />
						<div class="flex flex-row gap-2">
							<Input id="expiration-input" placeholder="Expiration Date" />
							<Input id="cvc-input" placeholder="CVC" />
						</div>
						<Input id="card-name" placeholder="Name on Card" />
						<Button id="last-btn" variant="fancy" on:click={onSubmitNewCard}>Add Card</Button>
					</div>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
	</div>
{/await}