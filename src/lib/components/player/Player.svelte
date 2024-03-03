<script lang="ts">
	import type { Game } from '$lib/game';
	import type { Player } from '$lib/player';
	import Controls from './Controls.svelte';
	import Details from './Details.svelte';

	export let player: Player;
	export let game: Game;

	const cards = player.hand.cards;
</script>

<div>
	<Details {player} />
	<div class="grid grid-cols-5">
		{#each $cards as card}
			<div>
				{card.toShortName('string')}
			</div>
		{/each}
	</div>
	<Controls {player} {game} />
</div>
