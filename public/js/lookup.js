var mount = 0;
var year = 0;
var make = 0;
var model = 0;
var style = 0;

$(document).ready(function () {

    $('.article p').css('margin','10px 5px 10px 5px').hide();

    document.getElementById('mount').selectedIndex = 0;
    $('#main #header #lookup select').css('display','block');
    $('#main #header #lookup input[type=image]').css('display','block');
    $('#year').html('<option value="0">- Select Year -</option>');
    $('#year').attr('disabled', 'disabled');
    $('#make').html('<option value="0">- Select Make -</option>');
    $('#make').attr('disabled', 'disabled');
    $('#model').html('<option value="0">- Select Model -</option>');
    $('#model').attr('disabled', 'disabled');
    $('#style').html('<option value="0">- Select Style -</option>');
    $('#style').attr('disabled', 'disabled');

    $('#mount').change(function () {
        mount = $(this).val();
        //$('#loaderYear').show();
        if (mount != 0 && mount != '') {
            $.get('http://api.curtmfg.com/v2/GetYear?mount=' + mount + '&dataType=JSONP&callback=handleYears', function (data) { }, 'jsonp');
            //$.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetYear&mount=' + mount + '&dataType=JSONP&callback=?', function (data) { }, 'jsonp');
        }
    });

    $('#year').change(function () {
        year = $(this).val();
        //$('#loaderMake').show();
        if (year != 0 && year != '') {
            $.get('http://api.curtmfg.com/v2/GetMake?year=' + year + '&mount=' + mount + '&dataType=JSONP&callback=handleMake', function (data) { }, 'jsonp');
            //$.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetMake&year=' + year + '&mount=' + mount + '&dataType=JSONP&callback=?', function (data) { }, 'jsonp');
        }
    });

    $('#make').change(function () {
        make = $(this).val();
        //$('#loaderModel').show();
        if (make != 0 && make != '') {
            $.get('http://api.curtmfg.com/v2/GetModel?make=' + make + '&year=' + year + '&mount=' + mount + '&dataType=JSONP&callback=handleModel', function (data) { }, 'jsonp');
            //$.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetModel&make=' + make + '&year=' + year + '&mount=' + mount + '&dataType=JSONP&callback=?', function (data) { }, 'jsonp');
        }
    });
    $('#model').change(function () {
        model = $(this).val();
        //$('#loaderStyle').show();
        if (model != 0 && model != '') {
            $.get('http://api.curtmfg.com/v2/GetStyle?model=' + model.replace('&', '%26') + '&make=' + make + '&year=' + year + '&mount=' + mount + '&dataType=JSONP&callback=handleStyle', function (data) { }, 'jsonp');
            //$.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetStyle&model=' + model.replace('&', '%26') + '&make=' + make + '&year=' + year + '&mount=' + mount + '&dataType=JSONP&callback=?', function (data) { }, 'jsonp');
        }
    });

    $('#style').change(function () {
        style = $(this).val();
        if (style != 0 && style != '') {
            $('#btnSearch').removeAttr('disabled');
        }
    });

    $('.article').mouseover(function () {
        $(this).animate({ height: '325px' });
        $(this).find('p').fadeIn();
    });
    $('.article').mouseleave(function () {
        $(this).animate({ height: '243px' });
        $(this).find('p').fadeOut();
    });



});

function handleYears(years){
    $.each(years,function(i,year){
       $('#year').append('<option>'+year+'</option>'); 
    });
    $('#make').html('<option value="0">- Select Make -</option>');
    $('#make').attr('disabled','disabled');
    $('#model').html('<option value="0">- Select Model -</option>');
    $('#model').attr('disabled','disabled');
    $('#style').html('<option value="0">- Select Style -</option>');
    $('#style').attr('disabled','disabled');
    $('#year').removeAttr('disabled');
    //$('#loaderYear').hide();
}

function handleMake(makes){
    $.each(makes,function(i,make){
       $('#make').append('<option>'+make+'</option>'); 
    });
    $('#model').html('<option value="0">- Select Model -</option>');
    $('#model').attr('disabled','disabled');
    $('#style').html('<option value="0">- Select Style -</option>');
    $('#style').attr('disabled','disabled');
    $('#make').removeAttr('disabled');
    //$('#loaderMake').hide();
}

function handleModel(models){
    $.each(models,function(i,model){
       $('#model').append('<option>'+model+'</option>'); 
    });
    $('#style').html('<option value="0">- Select Style -</option>');
    $('#style').attr('disabled','disabled');
    $('#model').removeAttr('disabled');
    //$('#loaderModel').hide();
}

function handleStyle(styles){
    $.each(styles,function(i,style){
       $('#style').append('<option>'+style+'</option>'); 
    });
    $('#style').removeAttr('disabled');
    //$('#loaderStyle').hide();
}