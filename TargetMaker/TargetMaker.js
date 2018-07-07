
var dpi = 96;
var width = 816;
var height = 1056;

function Point(x, y)
{
    this.X = x;
    this.Y = y;
}

function GetInput(input)
{
    var input = document.getElementById(input);
    return input.value;
}

function GetBool(input)
{
    var chkBox = document.getElementById(input);
    return chkBox.checked ? true : false;
}

function GetJsonFromInput()
{
    return '{"TopLeft": "' + GetInput('topLeftText')
       + '","BottomRight" : "' + GetInput('bottomRightText') + '",'
       + '"BottomLeft" : "' + GetInput('bottomLeftText') + '",'
       + '"TopRight" : "' + GetInput('topRightText') + '",'
       + '"Rings":[{"Display" : "X","Diameter" : '
       + GetInput('sizex') + ',"IsBull" : '
       + GetBool('bullx') + '},{"Display" : "10","Diameter" : '
       + GetInput('size10') + ',"IsBull" : '
       + GetBool('bull10') + '},{"Display" : "9","Diameter" : '
       + GetInput('size9') + ',"IsBull" : '
       + GetBool('bull9') + '},{"Display" : "8","Diameter" :'
       + GetInput('size8') + ',"IsBull" : '
       + GetBool('bull8') + '},{"Display" : "7","Diameter" : '
       + GetInput('size7') + ',"IsBull" : '
       + GetBool('bull7') + '},{"Display" : "6","Diameter" : '
       + GetInput('size6') + ',"IsBull" : '
       + GetBool('bull6') + '},{"Display" : "5","Diameter" : '
       + GetInput('size5') + ',"IsBull" : '
       + GetBool('bull5') + '},{"Display" : "4","Diameter" :'
       + GetInput('size4') + ',"IsBull" : '
       + GetBool('bull4') + '},{"Display" : "3","Diameter" : '
       + GetInput('size3') + ',"IsBull" : '
       + GetBool('bull3') + '},{"Display" : "2","Diameter" : '
       + GetInput('size2') + ',"IsBull" : '
       + GetBool('bull2') + '},{"Display" : "1","Diameter" : '
       + GetInput('size1') + ',"IsBull" : '
       + GetBool('bull1') + '}]}';
}

function reload()
{   
    dpi = GetInput('dpi');
    width = GetInput('targetWidth') * dpi;
    height = GetInput('targetHeight') * dpi;

    var canvas = document.getElementById('myCanvas');
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);
    var jsonString = GetJsonFromInput();

    var obj = JSON.parse(jsonString);

    var bulls = GetBulls(obj);

    var bullfontSize = document.getElementById('bullfontSize').value;
    var bullfont = bullfontSize + "px Arial";

    while (bulls.length > 0)
    {
        var o = bulls.pop();

        for (i = 0; i < obj.Rings.length; i++)
        {
            DrawCircle(o.X, o.Y, obj.Rings[i].Diameter * dpi, obj.Rings[i].IsBull);
        }

        for (i = 0; i < obj.Rings.length; i++)
        {
            DrawBorder(o.X, o.Y, obj.Rings[i].Diameter * dpi, obj.Rings[i].IsBull);
        }

        for (i = 0; i < obj.Rings.length; i++)
        {
            if (i == 0)
            {
                DrawText(o.X - 5, o.Y, obj.Rings[i].IsBull, obj.Rings[i].Display, bullfont);
            }
            else
            {
                DrawText((((o.X - (obj.Rings[i].Diameter * dpi / 2)) + (o.X - (obj.Rings[i - 1].Diameter * dpi / 2))) / 2) - 5, o.Y, obj.Rings[i].IsBull, obj.Rings[i].Display, bullfont);
            }
        }
    }

    var fontSize = document.getElementById('fontSize').value;
    var font = fontSize + "px Arial";

    DrawText(0, fontSize, false, obj.TopLeft, font);
    DrawText(0, canvas.height - fontSize, false, obj.BottomLeft, font);
    DrawText(canvas.width - 140, canvas.height - fontSize, false, obj.BottomRight, font);
    DrawText(canvas.width - 140, fontSize, false, obj.TopRight, font);

    // save canvas image as data url (png format by default)
    var dataURL = canvas.toDataURL('image/png', 1.0);
    document.getElementById('canvasImg').src = dataURL;// + '?' +  new Date().getTime();
}

function GetBulls(obj)
{
    var bullCount = 1;

    var maxSize = obj.Rings[0].Diameter;

    for (i = 1; i < obj.Rings.length; i++)
    {
        if (maxSize < obj.Rings[i].Diameter)
        {
            maxSize = obj.Rings[i].Diameter;
        }
    }

    // Margin 0.25 inch
    maxSize += 0.25;
    maxSize *= dpi;

    console.log('width = ' + width);
    console.log('height = ' + height);

    var rows = Math.max(1, Math.floor(width / maxSize));
    var columns = Math.max(1, Math.floor(height / maxSize));

    var bulls = [];


    if (rows == 1 && columns == 1)
    {
        bulls.push(new Point(width / 2, height / 2));
    }
    else
    {
        for (i = 0; i < rows; i++)
        {
            for (j = 0; j < columns; j++)
            {
                var x = maxSize / 2 + (i * maxSize);
                var y = maxSize / 2 + (j * maxSize);

                console.log(x);
                console.log(y);

                bulls.push(new Point(x, y));
            }
        }
    }

    return bulls;
}

function DrawCircle(centerX, centerY, diameter, fill)
{
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d')

    context.beginPath();
    context.arc(centerX, centerY, diameter / 2, 0, 2 * Math.PI, false);

    if (fill == true)
    {
        context.fillStyle = 'black';
        context.fill();
    }

    context.lineWidth = 1;
    context.strokeStyle = fill ? 'white' : 'black';
    context.stroke();
}

function DrawBorder(centerX, centerY, diameter, fill)
{
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d')

    context.beginPath();
    context.arc(centerX, centerY, diameter / 2, 0, 2 * Math.PI, false);

    context.lineWidth = 1;
    context.strokeStyle = fill ? 'white' : 'black';
    context.stroke();
}

function DrawText(centerX, centerY, fill, strText, font)
{
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d')

    context.font = font;
    context.fillStyle = fill ? 'white' : 'black';
    context.fillText(strText, centerX, centerY);
}
