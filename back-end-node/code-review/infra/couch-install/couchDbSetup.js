const delay_diff = 1500;
let delay = 0;

require('./corsConfig');

setTimeout(() => {
    require('./addTypeIndex');
}, delay += delay_diff);

setTimeout(() => {
    require('./addCommitsIndex');
}, delay += delay_diff);
