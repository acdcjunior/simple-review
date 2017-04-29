export class ArrayUtils {

    public static arrayShuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    public static flatten<T>(arrayDeArrays: T[][]): T[] {
        return [].concat.apply([], arrayDeArrays);
    }

}
