<script lang="ts">
	import type { Game } from '$lib/game';
	import type { Player } from '$lib/player';
	import Controls from './Controls.svelte';
	import Details from './Details.svelte';

	export let player: Player;
	export let game: Game;

	const cards = player.hand.cards;
	const value = player.hand.value;
	const state = player.state;
	const chips = player.chips;
	const bet = player.bet;

	const detailsClass = 'flex flex-row space-x-2';
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
