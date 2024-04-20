<script lang="ts">
    export let size = 24;
	export let color = 'white';

    let className = "";
    export { className as class }
</script>

<div>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={`width: ${size}px`}>
        <g data-name="Layer 2">
            <g data-name="plus">
                <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                <path
                    fill={color}
					d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"
				/>
            </g>
        </g>
    </svg>
</div>
