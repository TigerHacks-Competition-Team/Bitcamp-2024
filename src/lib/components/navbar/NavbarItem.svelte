<script lang="ts">
    export let name = "Item";
    export let href = "";

    let className = "";
    export { className as class }
</script>

<a {href}>
    <div class={`flex flex-col items-center w-min ${className}`}>
        <slot/>
        <span>{name}</span>
    </div>
</a>
