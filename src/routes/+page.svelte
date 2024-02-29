<script lang="ts">
	const options = [
		{ name: 'play', path: '/play' },
		{ name: 'about', path: '/about' }
	];
</script>

<h1>blackjack trainer</h1>
<div class="flex flex-col">
	{#each options as option}
		<a href={option.path}>{option.name}</a>
	{/each}
</div>
