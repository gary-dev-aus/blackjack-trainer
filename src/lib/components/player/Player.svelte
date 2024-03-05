<script lang="ts">
	import type { Game } from '$lib/game';
	import type { Player } from '$lib/player';
	import Controls from './Controls.svelte';
	import Details from './Details.svelte';

	export let player: Player;
	export let game: Game;

	const cards = player.hand.cards;
	const isRevealed = player.isRevealed;
</script>

<div>
	<Details {player} />
	<div class="grid grid-cols-5">
		{#each $cards as card}
			{#key $isRevealed}
				<div>
					{card.toShortName('string')}
				</div>
			{/key}
		{/each}
	</div>
	<Controls {player} {game} />
</div>
