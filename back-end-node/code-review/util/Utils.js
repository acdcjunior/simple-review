class Utils {

    static printBar(times) {
        let n = times || 1;
        for (let i = 0; i < n; i++) {
            console.log('------------------------------------------------------------');
        }
    }

}

module.exports = Utils;