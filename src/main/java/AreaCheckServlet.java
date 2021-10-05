import beans.Entries;
import beans.PointEntry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=UTF-8");
        Entries entries = (Entries) req.getSession().getAttribute("entries");
        if (entries == null) entries = new Entries();

        long initTime = System.nanoTime();
        String strX = req.getParameter("x");
        String strY = req.getParameter("y");
        String strR = req.getParameter("r");

        boolean isValid = false, isHit = false;
        double x = 0;
        double y = 0, r = 0;
        try {
            x = Double.parseDouble(strX);
            y = Double.parseDouble(strY);
            r = Double.parseDouble(strR);
            isValid = true;
            isHit = isHit(x, y, r);
        } catch (NumberFormatException e) {
            isValid = false;
        }

        resp.setHeader("isValid", String.valueOf(isValid));
        PrintWriter pw = resp.getWriter();

        if (isValid) {
            String finishTime = new SimpleDateFormat("HH:mm:ss").format(new Date());
            String execDuration = String.valueOf(new DecimalFormat("#0.0000").format((System.nanoTime() - initTime) / 1e9));
            PointEntry entry = new PointEntry(
                    truncateDouble(x, 4),
                    truncateDouble(y, 4),
                    truncateDouble(r,4),
                    finishTime,
                    execDuration,
                    isHit);
            entries.getEntries().add(entry);
            req.getSession().setAttribute("entries", entries);
            pw.println(generateRow(entry));
            pw.close();
        }
    }

    private Double truncateDouble(double valueToTruncate, int decimalPlaces) {
        return BigDecimal.valueOf(valueToTruncate).setScale(decimalPlaces, RoundingMode.HALF_UP).doubleValue();
    }

    private String generateRow(PointEntry entry) {
        NumberFormat nf = NumberFormat.getInstance();
        nf.setMaximumFractionDigits(3);
        return (entry.isHit() ? "<tr class=\"hit-yes\">" : "<tr class=\"hit-no\">") +
                "<td>" + entry.getX() + "</td>" +
                "<td>" + entry.getY() + "</td>" +
                "<td>" + entry.getR() + "</td>" +
                "<td>" + entry.getCurrentTime() + "</td>" +
                "<td>" + entry.getExecTime() + "</td>" +
                "<td>" + (entry.isHit() ? "<img src=\"img/tick.png\" alt=\"Да\" class=\"yes-no-marker\">" : "<img src=\"img/cross.png\" alt=\"Нет\" class=\"yes-no-marker\">") + "</td>";
    }

    private boolean isSquareHit(double x, double y, double r) {
        return x >= 0 && y >= 0 && x <= r && y <= r;
    }

    private boolean isCircleHit(double x, double y, double r) {
        return y >= 0 && x <= 0 && (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r/2, 2));
    }

    private boolean isTriangleHit(double x, double y, double r) {
        return x >= 0 && y <= 0 && y >= (0.5 * x - 0.5 * r);
        // 1/2 * x - R/2
    }

    private boolean isHit(double x, double y, double r) {
        return isCircleHit(x, y, r) || isSquareHit(x, y, r) || isTriangleHit(x, y, r);
    }


}
