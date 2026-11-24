import { IExecuteFunctions } from 'n8n-workflow';
import { APIFY_ACTOR_HOST_SUFFIX } from '../helpers/consts';
import { apiRequest } from './genericFunctions';

/**
 * Server Actors answer HTTP requests at their `standbyUrl` instead of starting a run (the API
 * still uses the old "standby" names).
 *
 * Every request may be charged, so it is never retried, and no message suggests retrying.
 */

const CHARGED = 'The request may still have been charged.';

export const SERVER_ACTOR_MESSAGES = {
	noServerInterface:
		'This Actor has no server interface. Use the Run an Actor operation to start a run instead.',
	timeout: `The Actor didn't answer in time (Apify waits up to 300 s). ${CHARGED}`,
	binary: `The Actor returned a binary response, which is not supported yet. ${CHARGED}`,
	charged: CHARGED,
};

interface ServerActor {
	standbyUrl?: string;
	actorStandby?: { isEnabled?: boolean };
}

/**
 * The origin of the Actor's server, or `undefined` when the Actor has no server interface. Only
 * `https://*.apify.actor` hosts count: the request carries the connection's token.
 */
export async function getServerActorOrigin(
	this: IExecuteFunctions,
	actorId: string,
): Promise<string | undefined> {
	const { data: actor } = (await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}`,
	})) as { data?: ServerActor };
	if (!actor?.actorStandby?.isEnabled || typeof actor.standbyUrl !== 'string') return undefined;
	try {
		const url = new URL(actor.standbyUrl);
		if (url.protocol !== 'https:' || !url.hostname.endsWith(APIFY_ACTOR_HOST_SUFFIX)) {
			return undefined;
		}
		return url.origin;
	} catch {
		return undefined;
	}
}
