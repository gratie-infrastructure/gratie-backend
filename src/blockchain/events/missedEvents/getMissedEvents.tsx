import getPastEvents from './getPastEvents';
import addEvent from '../helpers/addEvent';


async function getMissedEvents(eventName, startBlockNumber = 0) {
  try {
    const response = await getPastEvents(eventName, startBlockNumber);
    // const transactionHashes = [];

    for (const event of response.events) {
      await addEvent(event, true);
      // if (response) {
      //     transactionHashes.push(event.transactionHash);
      // }
    }

    console.log(`\nEvent Name: ${eventName}`);
    // console.log("Transaction hashes of missed events added: ", transactionHashes);
    // console.log("Total missed events added: ", transactionHashes.length);
    console.log(`Events added between blocks: ${response.startBlockNumber} and ${response.endBlockNumber}`);

    return {
      eventName: eventName,
      // totalEventsAdded: transactionHashes.length,
      // transactionHashes: transactionHashes,
      startBlock: response.startBlockNumber,
      endBlock: response.endBlockNumber,
    };
  } catch (error) {
    console.error('getMissedEvents :', error.message);
  }
}

export default getMissedEvents;
