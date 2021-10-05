<%@ page import="beans.PointEntry" %>
<%@ page import="java.util.Collections" %>
<%@ page import="java.util.List" %>
<jsp:useBean id="entries" class="beans.Entries" scope="session"/>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lab #1</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<table id="headerContainer">
    <tr>
        <td><h1 id="mainHeaderText">Web. Лабораторная работа №2.</h1></td>
        <td id="rightHeaderPart">
            <h2>Вариант № 765543</h2>
            <h3>Полошков Борис, P3213</h3>
        </td>
    </tr>
</table>
<div id="imageContainer">
    <object id="result-grid" type="image/svg+xml" data="img/graph.svg"></object>
    <canvas id="graph-canvas" width="300" height="300">Интерактивная область графика</canvas>
</div>
<table id="inputContainer">
    <tr id="inputDataHeader">
        <td colspan="100%">
            <h2>Введите данные:</h2>
        </td>
    </tr>

    <tr id="inputY">
        <td>
            <label for="yCoordinate">
                Y:
            </label>

        </td>
        <td>
            <input type="text" id="yCoordinate" size=100% placeholder="Введите число в интервале (-3; 3)" maxlength="15">
        </td>
    </tr>

    <tr id="inputR">
        <td>
            R:
        </td>

        <td id="rRadio" class="options">
            <% for (int i = 1; i <= 5; i++) { %>
            <label>
                <input type="checkbox" name="r" value="<%=i%>">
                <%=i%>
            </label>
            <% } %>
        </td>
    </tr>

    <tr id="inputX">
        <td>
            X:
        </td>
        <td id="XSelectRow">
            <label for="XSelect"></label>
            <select id="XSelect">
                <option value="">Выберите X</option>
                <% for (int i = -4; i <= 4; i++) { %>
                <option name="XValue" value="<%=i%>"><%=i%></option>
                <% } %>
            </select>
        </td>
    </tr>

    <tr>
        <td colspan="100%" id="buttonContainer">
            <button class="submit-button" type="submit" onclick="submit()">Let's go!</button>
        </td>
    </tr>
</table>

<table id="result-table">
    <tr class="table-header">
        <th>X</th>
        <th>Y</th>
        <th>R</th>
        <th>Локальное время</th>
        <th>Время исполнения</th>
        <th>Попадание</th>
    </tr>
    <% List<PointEntry> entryList = entries.getEntries();
    Collections.reverse(entryList);
    for (PointEntry entry: entryList) { %>
    <tr class="<%=(entry.isHit()? "hit-yes": "hit-no")%>">
        <td class="x-table-value"><%=entry.getX()%></td>
        <td class="y-table-value"><%=entry.getY()%></td>
        <td class="r-table-value"><%=entry.getR()%></td>
        <td><%=entry.getCurrentTime()%></td>
        <td><%=entry.getExecTime()%></td>
        <td><%=(entry.isHit() ? "<img src=\"img/tick.png\" alt=\"Да\" class=\"yes-no-marker\">" : "<img src=\"img/cross.png\" alt=\"Нет\" class=\"yes-no-marker\">")%></td>
    </tr>
    <% } %>
</table>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/main.js"></script>
</body>
</html>
