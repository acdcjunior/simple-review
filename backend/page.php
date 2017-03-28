<?php

require_once "infra/rest.php";
require_once "CodeReviewRepository.php";
require_once "CommitterRepository.php";




//$commits = rest("GET", "https://gitlab.com/api/v4/projects/2982376/repository/commits/?since=2017-03-26T22:14:54.000-03:00", "zZKohysiaQwizBySUF2N");
$commits = rest("GET", "http://git/api/v4/projects/123/repository/commits/?ref_name=desenvolvimento&per_page=100", "EsspXz7kinZN9RayS8sG");


$jenkinsUT = rest("GET", "http://srv-ic-master:8089/view/Sesol-2/job/sagas2.dese.unit/api/json?pretty=true", "EsspXz7kinZN9RayS8sG")->color;
$jenkinsIT = rest("GET", "http://srv-ic-master:8089/view/Sesol-2/job/sagas2.dese.integ/api/json?pretty=true", "EsspXz7kinZN9RayS8sG")->color;

?>

<!doctype html>
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />

    <title>Layout Container</title>

    <link type="text/css" rel="stylesheet" href="web/layout-default-latest.css" />
    <style type="text/css">
        html, body {
            background:	#666;
            width:		100%;
            height:		100%;
            padding:	0;
            margin:		0;
            overflow:	auto; /* when page gets too small */
        }
        #container {
            background:	#999;
            height:		100%;
            margin:		0 auto;
            width:		100%;
            @max-width:	900px;
            @min-width:	700px;
            @_width:		700px; /* min-width for IE6 */
        }
        .pane {
            display:	none; /* will appear when layout inits */
            padding: 0;
        }
        .ui-layout-west {
        }

        body {
            font-family: 'Open Sans', sans-serif;
        }
        table, tr, td {
            border: 1px solid rgba(0,0,0,0.1);
        }
        .avatar {
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.1);
            width: 36px;
            height: 36px;
            margin-right: 10px;
        }
        .message {
            font-size: small;
            max-width: 340px;
            border-bottom: 1px solid black;
        }
        .message a {
            color: #3777b0;
            text-decoration: none;
            font-weight: bold;
        }
        .message a:hover {
            text-decoration: underline;
        }
        #commits {
            width: 100%;
        }
        .truncate {
            /*width: 320px;*/
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .commit, .commit * {
            border: 0;
        }
        .autor {
            display: flex;
            /*justify-content: center; !* align horizontal *!*/
            align-items: center;
            font-size: small;
        }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

    <script type="text/javascript" src="web/jquery-latest.js"></script>
    <script type="text/javascript" src="web/jquery-ui-latest.js"></script>
    <script type="text/javascript" src="web/jquery.layout-latest.js"></script>
    <script type="text/javascript" src="web/jquery.timeago.js"></script>
    <script type="text/javascript" src="web/jquery.timeago.pt-br.js"></script>
    <script type="text/javascript">

        $(document).ready(function () {
            $('#container').layout({
                west__size: '20%',
                panes: {
                    east: false
                }
            })
            ;
        });

    </script>

    <link rel="stylesheet" href="web/slicknav/slicknav.css" />
    <link rel="stylesheet" href="web/buttons.css" />
    <script src="web/slicknav/jquery.slicknav.min.js"></script>
</head>
<body>
<div id="container">
<div class="pane ui-layout-west">

    <div id="navbar">
        <ul id="menu-navbar">
            <li><a class="scroll" href="#features">Features</a></li>
            <li><a class="scroll" href="#usage">Usage Instructions</a></li>
            <li><a class="scroll" href="#examples">Examples</a></li>
            <li><a href="http://github.com">View on Github</a></li>
        </ul>
    </div>
    <script>
        $('#menu-navbar').slicknav({
            label: 'Sesol-2 Code Review',
            duration: 0,
            prependTo:'#navbar'
        }).hide();
    </script>


    UT: <a href="http://jenkins/view/Sesol-2/job/sagas2.dese.unit/"><img src="http://jenkins/static/48484716/images/32x32/<?=$jenkinsUT?>.gif"></a>
    &emsp;
    IT: <a href="http://jenkins/view/Sesol-2/job/sagas2.dese.integ/"><img src="http://jenkins/static/48484716/images/32x32/<?=$jenkinsIT?>.gif"></a>

<table id="commits"></table>

<?php
function cell($c) {
    return "<td>$c</td>";
}
$committers = array();

foreach($commits as $commit) {
    $committers[] = $commit->author_email;

    $codeReviewRepository = new CodeReviewRepository();
    $codeReviewRepository->insert('011a25f583ff33648430c31385b6d88433d9b75c', $commit->message, $commit->author_email, $commit->created_at);
}

$committerRepository = new CommitterRepository();
$committersToJson = array();

$committers = array_unique($committers);
foreach($committers as $committer) {
    $users = rest("GET", "http://git/api/v3/users/?search=$committer", "EsspXz7kinZN9RayS8sG");

    if (sizeof($users) === 1) {
        $user = $users[0];

        $object = new stdClass();
        $object->email = $committer;
        $object->nome = $user->name;
        $object->avatar_url = $user->avatar_url;
        $committersToJson[] = $object;

        //$committerRepository->insert($committer, $user->avatar_url);
    }
}

?>

    <!--suppress JSUnusedAssignment -->
    <script>
        var commits = <?= json_encode($commits) ?>;
        console.log(commits);
        var committers = <?= json_encode($committersToJson) ?>;
        console.log(committers);

        commits.forEach(function (commit) {
            $("#commits").append(`
            <tr>
            <td>
                <table class='commit'>
                <tr>
                    <td>
                    <div class='message truncate'><a href='#' data-diff-url='http://git/sti/sagas2/commit/${commit.id}' class='diff-link'>${commit.title}</a></div>
                    </td>
                </tr>
                <tr>
                    <td class='autor truncate'>
                        <span data-email='${commit.author_email}'>${commit.author_email}</span>
                        <strong>${commit.author_name}</strong>  &nbsp; ${jQuery.timeago(Date.parse(commit.created_at))}
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="botoes" style="display: none">
                            <a href="#" class="buttons save">Marcar como Revisado</a>
	                        <a href="#" class="buttons hot_drink">Fizemos em Par</a>
	                        <a href="#" class="buttons add">Incluir Outro Revisor</a>
	                        <br>
	                    </div>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
            `);
        });

        committers.forEach(function (c) {
            $("[data-email='"+c.email+"']").addClass("processado").html("<img class='avatar' src='"+c.avatar_url+"'/>")
        });
        $("[data-email]:not(.processado)").html("<img class='avatar' src='http://st10.cannypic.com/thumbs/19/191849_352_canny_pic.png'/>");
        $(".diff-link").click(function () {
            let $linkClicado = $(this);


            let botoesDesteLink = $linkClicado.closest('.commit').find('.botoes');
            if (botoesDesteLink.is(":hidden")) {
                let velocidade = 300;
                $('.botoes').slideUp(velocidade);
                setTimeout(function () {
                    $("#diff").attr("src", $linkClicado.data("diff-url"));
                }, 100);
                botoesDesteLink.slideToggle(velocidade);
            }
        });
    </script>
    </div>
    <div class="pane ui-layout-center">
        <iframe id="diff" width="100%" height="99%" frameborder="0" marginheight="0" marginwidth="0" scrolling="yes"></iframe>
    </div>
</div>
</body>
</html>