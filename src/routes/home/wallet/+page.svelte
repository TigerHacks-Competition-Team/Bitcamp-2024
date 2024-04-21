<script>
	import * as Dialog from "$lib/components/ui/dialog";
	// import CreditCard from '$lib/components/CreditCard.svelte';
	//@ts-ignore
	import CreditCard from "svelte-credit-cards";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
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
</script>

<p class="text-primary-foreground mb-3">Wallet</p>

<div
	class="flex flex-col gap-4 mx-3 overflow-y-scroll pb-[150px]"
	style="scrollbar-width:none; -ms-overflow-style: none;"
>
	{#each cards as card}
		<!-- <CreditCard /> -->
		<CreditCard number={card.number} name={card.name} expiry={card.expiry} cvc={card.cvc} />
	{/each}
    <Dialog.Root>
        <Dialog.Trigger>
            <Button variant="fancy">Add Card</Button>
        </Dialog.Trigger>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title class="mb-2">Add a Credit Card</Dialog.Title>
                <div class="flex flex-col gap-2">
                    <Input placeholder="Card Number" />
                    <div class="flex flex-row gap-2">
                        <Input placeholder="Expiration Date" />
                        <Input placeholder="CVC" />
                    </div>
                    <Input placeholder="Name on Card" />
                    <Button variant="fancy">Add Card</Button>
                </div>
            </Dialog.Header>
        </Dialog.Content>
    </Dialog.Root>
</div>
