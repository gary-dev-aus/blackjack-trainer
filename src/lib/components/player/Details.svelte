<script lang="ts">
	import type { Player } from '$lib/player';

	export let player: Player;

	const playerState = player.state;
	const hand = player.hand.cards;
	const value = player.hand.value;
	const chips = player.chips;
	const bet = player.bet;

	const detailsClass = 'flex flex-row space-x-2';
</script>

<p>{player.name}</p>
<div class={detailsClass}>
	{#if $hand.length > 0}
		<p>Value: {$value}</p>
	{/if}
	{#if $playerState === 'bust'}
		<p>Bust!</p>
	{:else if $playerState === 'blackjack'}
		<p>Blackjack!</p>
	{/if}
</div>
{#if !player.isDealer}
	<div class={detailsClass}>
		<p>Chips: {$chips}</p>
		{#if $bet.amount === 0}
			<p>No bet</p>
		{:else}
			<p>Bet: {$bet.amount}</p>
		{/if}
	</div>
{/if}
