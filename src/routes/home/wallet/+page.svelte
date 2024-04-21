<script>
    // import CreditCard from '$lib/components/CreditCard.svelte';
    //@ts-ignore
    import CreditCard from "svelte-credit-cards";
    import Button from '$lib/components/ui/button/button.svelte';
    const cards = [{
        number:"5413638888246748",
        name: "John Doe",
        expiry: "12/24",
        cvc: Math.round(10**3+Math.random() * 10**2).toString()
    
    },{
        number: "4576597203880936",
        name: "John Doe",
        expiry: "08/25",
        cvc: Math.round(10**3+Math.random() * 10**2).toString()
    
    }]
</script>

<p class="text-primary-foreground mb-3">Wallet</p>

<div class="flex flex-col gap-4 mx-3 overflow-y-scroll pb-[150px]" style="scrollbar-width:none; -ms-overflow-style: none;">
    {#each cards as card}
        <!-- <CreditCard /> -->
        <CreditCard number={card.number} name={card.name} expiry={card.expiry} cvc={card.cvc} />
    {/each}
    <Button variant="fancy">Add Card</Button>
</div>