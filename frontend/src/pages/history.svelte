<script lang="ts">
	import { useSession } from "$lib/auth";
	import Sidebar from "$lib/components/sidebar.svelte";
	import { navigate } from "$lib/router";

	type Turn = {
		timestamp: string;
		speaker: "agent" | "caller";
		text: string;
		phase: string;
		flags?: string[];
		note?: string | null;
	};

	type ScoreEntry = {
		score: number;
		reasoning: string;
		confidence: { score: number; concerns: string[] };
	};

	type AnalysisResult = {
		call_id: string;
		analyzed_at: string;
		metadata: {
			agent_name: string;
			call_label: string;
			call_duration: string;
			tags: string[];
		};
		summary: string;
		upsides: string[];
		downsides: string[];
		confidence: { score: number; concerns: string[] };
		scores: {
			professionalism: ScoreEntry;
			call_management: ScoreEntry;
			accuracy_and_completeness: ScoreEntry;
			caller_experience: ScoreEntry;
			overall: number;
		};
		turns: Turn[];
	};

	type AnalysisData = {
		transcript: string;
		phasedTurns: { turns: Turn[] };
		annotatedTurns: { turns: Turn[] };
		result: AnalysisResult;
	};

	type CallRecord = {
		id: string;
		userId: string;
		status: string;
		analysisData: AnalysisData | null;
		assemblyData: Record<string, any> | null;
		s3Key: string | null;
		createdAt: string;
		updatedAt: string;
	};

	const session = useSession();
	let callAnalysisHistory = $state<CallRecord[]>([]);

	$effect(() => {
		console.log("$session:", JSON.stringify($session));

		if (!$session?.isPending && !$session.data) {
			navigate("/login");
			return;
		}

		const userId = $session?.data?.user.id;
		if (!userId) return;

		fetch(`/api/history/${userId}`)
			.then((res) => res.json())
			.then((data) => {
				console.log("data:", data);
				callAnalysisHistory = data;
				console.log(data);
			})
			.catch((err) => console.error("fetch failed:", err));
	});
</script>

{#if $session.isPending}
	<p>Loading</p>
{:else if $session.data}
	<div class="flex">
		<Sidebar />
		<div
			class="flex items-center justify-center w-full h-screen bg-red-500"
		>
			<div class="w-4/5 h-1/2 border bg-black">
				<!-- <ul>
					{#each callAnalysisHistory as record}
						<li class=""></li>
					{/each}
				</ul> -->
				<table class="bg-gray-600 w-full">
					<caption> Front-end web developer course 2021 </caption>
					<thead>
						<!-- <tr>
      <th scope="col">Person</th>
      <th scope="col">Most interest in</th>
      <th scope="col">Age</th>
    </tr> -->
						<tr>
							<th scope="col">Date</th>
							<th scope="col">Name</th>
							<th scope="col">Duration</th>
							<th scope="col">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each callAnalysisHistory as record}
							<tr>
								<th scope="row" class="date"
									>{record.analysisData?.result?.analyzed_at}</th>
								<th scope="row" class="name">{record.analysisData?.result?.metadata?.call_label}</th>
                <th scope="row" class="duration">{record.analysisData?.result?.metadata?.call_duration}</th>
                <th scope="row" class="Score">{record.analysisData?.result?.scores.overall}</th>
							</tr>
						{/each}
						<!-- <tr>
							<th scope="row">Sarah</th>
							<td>JavaScript frameworks</td>
							<td>29</td>
						</tr>
						<tr>
							<th scope="row">Karen</th>
							<td>Web performance</td>
							<td>36</td>
						</tr> -->
					</tbody>
					<tfoot>
						<!-- <tr>
							<th scope="row" colspan="2">Average age</th>
							<td>33</td>
						</tr> -->
					</tfoot>
				</table>
			</div>
		</div>
	</div>
{:else}
	<p>Please sign in.</p>
{/if}
