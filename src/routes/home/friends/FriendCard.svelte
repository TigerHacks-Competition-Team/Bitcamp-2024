<script lang="ts">
	import Avatar from "$lib/components/Avatar.svelte";

    export let friend: User;
</script>

<div class="flex gap-5 px-5 py-4 rounded-md border items-center bg-[#1D1D21]">
    <div class="w-16 h-16">
        <Avatar firstName={friend.first_name[0]} lastName={friend.last_name[0]} size={65}/>
    </div>
    
    <div class="flex flex-col text-sm">
        <span>{friend.first_name} {friend.last_name}</span>
        <span>{friend.email}</span>
    </div>
</div>
