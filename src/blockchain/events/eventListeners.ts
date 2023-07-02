import {ethers} from 'ethers';
import eventFilters from './helpers/eventFilters';
import addEvent from './helpers/addEvent';
import getMissedEvents from './missedEvents/getMissedEvents';

const expectedPongBackDuration: any = process.env.WEBSOCKET_EXPECTED_PONG_BACK_DURATION;
const keepAliveCheckInterval: any = process.env.WEBSOCKET_KEEP_ALIVE_CHECK_INTERVAL;
const webSocketUrl: any = process.env.WEB_SOCKET_URL;

// Websocket provider.
let provider: any;
// Tracks total websocket disconnects.
let totalWebsocketDisconnects = 0;

/**
 * @description Gets all missed events and adds them to db when websocket connection restarts.
 */
async function getAllMissedEvents() {
  try {
    // await getMissedEvents('BusinessNftTierAdded');
    // await getMissedEvents('BusinessNftTiersActivated');
    // await getMissedEvents('BusinessNftTiersDeactivated');
    await getMissedEvents('BusinessRegistered');
    await getMissedEvents('BusinessRegisteredByOwner');
    // await getMissedEvents('ServiceProviderDivisionAdded');
    await getMissedEvents('ServiceProvidersRegistered');
    await getMissedEvents('ServiceProvidersRemoved');
    await getMissedEvents('RewardTokensGenerated');
    await getMissedEvents('RewardDistributionCreated');
    await getMissedEvents('RewardTokensClaimed');
  } catch (error) {
    console.error('getAllMissedEvents :', error.message);
  }
}


export default async function contractEventListener() {
  console.log('coming in contractEventListener');
  try {
    provider = new ethers.providers.WebSocketProvider(webSocketUrl);

    let pingTimeout: any = null;
    let keepAliveInterval: any = null;

    // Connection open, ping it at intervals, if no response, terminate connection and create a new one.
    provider._websocket.on('open', async () => {
      // Look for any missed events while websocket was down, add to database if any.
      getAllMissedEvents();
      // Keep pinging the connection.
      keepAliveInterval = setInterval(() => {
        // Checking websocket connection status.
        provider._websocket.ping();
        // If no response within timeout limit, restart websocket.
        pingTimeout = setTimeout(() => {
          provider._websocket.terminate();
        }, parseInt(expectedPongBackDuration));
      }, parseInt(keepAliveCheckInterval));


      // Listen to contract events here.
      console.log('Listening to gratie contract events...');

      provider.on(eventFilters.BusinessNftTierAdded, (event: any) => {
        // add event to db
        addEvent(event, 'BusinessNftTierAdded');
      });
      provider.on(eventFilters.BusinessNftTiersActivated, (event: any) => {
        // add event to db
        addEvent(event, 'BusinessNftTiersActivated');
      });
      provider.on(eventFilters.BusinessNftTiersDeactivated, (event: any) => {
        // add event to db
        addEvent(event, 'BusinessNftTiersDeactivated');
      });
      provider.on(eventFilters.BusinessRegistered, (event: any) => {
        // add event to db
        addEvent(event, 'BusinessRegistered');
      });
      provider.on(eventFilters.BusinessRegisteredByOwner, (event: any) => {
        // add event to db
        addEvent(event, 'BusinessRegisteredByOwner');
      });
      provider.on(eventFilters.ServiceProviderDivisionAdded, (event: any) => {
        // add event to db
        addEvent(event, 'ServiceProviderDivisionAdded');
      });
      provider.on(eventFilters.ServiceProvidersRegistered, (event: any) => {
        // add event to db
        addEvent(event, 'ServiceProvidersRegistered');
      });
      provider.on(eventFilters.ServiceProvidersRemoved, (event: any) => {
        // add event to db
        addEvent(event, 'ServiceProvidersRemoved');
      });
      provider.on(eventFilters.RewardTokensGenerated, (event: any) => {
        // add event to db
        addEvent(event, 'RewardTokensGenerated');
      });
      provider.on(eventFilters.RewardDistributionCreated, (event: any) => {
        // add event to db
        addEvent(event, 'RewardDistributionCreated');
      });
      provider.on(eventFilters.RewardTokensClaimed, (event: any) => {
        // add event to db
        addEvent(event, 'RewardTokensClaimed');
      });
    });


    // Websocket connection closed => Clear the timeout and interval, and restart the websocket.
    provider._websocket.on('close', () => {
      console.log('Websocket Disconnect No: ', ++totalWebsocketDisconnects);
      clearInterval(keepAliveInterval);
      clearTimeout(pingTimeout);
      contractEventListener();
    });


    // Pong received => Websocket is alive => Clear the pingTimeout.
    provider._websocket.on('pong', () => {
      console.log('Connection is alive! Disconnects till now: ', totalWebsocketDisconnects);
      clearTimeout(pingTimeout);
    });

    provider._websocket.on('error', (error: any) => {
      console.log('Websocket Error: ', error);
      provider._websocket.terminate();
    });
  } catch (error) {
    console.log(error);
  }
}

// export default contractEventListener();
