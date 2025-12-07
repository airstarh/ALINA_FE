export default function Expect(objectLookFor, propLookFor, objectTarget, propTarget) {
    
    const retryMax = 5;
    let counter = 0;

    return new Promise((resolve, reject) => {
        const expect = () => {
            counter++;
            if (objectLookFor[propLookFor] !== undefined) {
                objectTarget[propTarget] = objectLookFor[propLookFor]; // Set the class property
                resolve(objectTarget[propTarget]);      // Resolve the Promise with the value
                return;
            } else {
                if (counter >= retryMax) { 
                    reject(new Error(`Holly shit, too many fucking indians...`));
                    return; 
                }

                setTimeout(expect, 1);
            }
        };
        expect(); // Start the first check
    });
}