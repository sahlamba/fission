// Global object with content of custom files (to be added to application)

var _files = {
  'AppConfig': function (packageName) { // JAVA
    return 'package ' + packageName + '.config;\n\
\n\
import java.text.SimpleDateFormat;\n\
import java.util.List;\n\
\n\
import org.springframework.context.annotation.Bean;\n\
import org.springframework.context.annotation.ComponentScan;\n\
import org.springframework.context.annotation.Configuration;\n\
import org.springframework.http.converter.HttpMessageConverter;\n\
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;\n\
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;\n\
import org.springframework.web.servlet.ViewResolver;\n\
import org.springframework.web.servlet.config.annotation.EnableWebMvc;\n\
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;\n\
\n\
import com.fasterxml.jackson.datatype.joda.JodaModule;\n\
\n\
@Configuration\n\
@EnableWebMvc\n\
@ComponentScan(basePackages =  "' + packageName + '")\n\
public class AppConfig extends WebMvcConfigurerAdapter {\n\
  \n\
	@Bean\n\
	public ViewResolver jspViewResolver() {\n\
		return new jspViewResolver();\n\
	}\n\
  \n\
	@Override\n\
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {\n\
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder()\n\
                .indentOutput(true)\n\
                .dateFormat(new SimpleDateFormat("yyyy-MM-dd"))\n\
                .modulesToInstall(new JodaModule());\n\
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));\n\
    }\n\
    \n\
}';
  },
  'JSONModelData': function (packageName) { // JAVA
    return 'package ' + packageName + '.config;\n\
\n\
import java.lang.reflect.InvocationTargetException;\n\
import java.util.Enumeration;\n\
import java.util.regex.Pattern;\n\
import java.util.regex.Matcher;\n\
\n\
import javax.servlet.http.HttpServletRequest;\n\
\n\
import org.json.simple.JSONObject;\n\
\n\
import com.fasterxml.jackson.core.JsonProcessingException;\n\
import com.fasterxml.jackson.databind.ObjectMapper;\n\
import com.fasterxml.jackson.databind.SerializationFeature;\n\
import com.fasterxml.jackson.datatype.joda.JodaModule;\n\
\n\
public class JSONModelData {\n\
  \n\
	/*\n\
	 * Checks if a key in the request object is a Spring specific (eg.\n\
	 * javax.servlet.*, org.springframework.*)\n\
	 *\n\
	 * Uses RegEx to match strings\n\
	 */\n\
	private static boolean stringContainsItemFromList(String inputString) {\n\
		String javaxServlet = "javax.servlet.(.+)";\n\
		String springframework = "org.springframework.(.+)";\n\
    \n\
		Pattern javaxServletRex = Pattern.compile(javaxServlet);\n\
		Pattern springframeworkRex = Pattern.compile(springframework);\n\
    \n\
		Matcher javaxServletMatcher = javaxServletRex.matcher(inputString);\n\
		Matcher springframeworkMatcher = springframeworkRex.matcher(inputString);\n\
    \n\
		return javaxServletMatcher.find() || springframeworkMatcher.find() || inputString == "dandelionContext" || inputString == "encodingFilter.FILTERED";\n\
	}\n\
  \n\
	/*\n\
	 * Retrieves Model data from attributes, converts and returns as a\n\
	 * JSONObject to be rendered in the JSP view (jsonData.jsp)\n\
	 */\n\
	@SuppressWarnings("unchecked")\n\
	public JSONObject getModelData(HttpServletRequest req)\n\
			throws IllegalAccessException, InvocationTargetException, JsonProcessingException {\n\
        \n\
		// Get attribute names from request object\n\
		Enumeration<String> e = req.getAttributeNames();\n\
		// New JSONObject (to be returned to view)\n\
		JSONObject json = new JSONObject();\n\
		// Jackson Object Mapper to convert POJO to JSON\n\
		ObjectMapper mapper = new ObjectMapper();\n\
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);\n\
    \n\
		/* Register JodaModule to mapper and configure to convert\n\
		 * Java Date objects to String Date formats readable by JavaScript\n\
		 *\n\
		 * Default format of converted date is yyyy-MM-dd\n\
		 */\n\
		mapper.registerModule(new JodaModule());\n\
		mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);\n\
    \n\
		while (e.hasMoreElements()) {\n\
			String name = (String) e.nextElement();\n\
			if (JSONModelData.stringContainsItemFromList(name)) {\n\
				/* If name is of the format that is to be ignored\n\
				 * Ex. - Request data that is not required by front-end\n\
				 * like pathVariable (org.springframework.*.pathVariables)\n\
				 * then it is NOT added to JSONObject\n\
				 */\n\
			} else {\n\
				Object value = req.getAttribute(name);\n\
				json.put(name, mapper.writeValueAsString(value));\n\
			}\n\
		}\n\
		return json;\n\
	}\n\
  \n\
}';
  },
  'jspViewResolver': function (packageName, jstlPrefix, startJspName) { // JAVA
    return 'package ' + packageName + '.config;\n\
\n\
import java.util.Locale;\n\
\n\
import org.springframework.web.servlet.View;\n\
import org.springframework.web.servlet.ViewResolver;\n\
import org.springframework.web.servlet.view.InternalResourceView;\n\
import org.springframework.web.servlet.view.InternalResourceViewResolver;\n\
\n\
public class jspViewResolver implements ViewResolver {\n\
	InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();\n\
  \n\
	@Override\n\
	public View resolveViewName(String viewName, Locale locale) throws Exception {\n\
		viewResolver.setOrder(0);\n\
		if (viewName.compareTo("' + startJspName + '") == 0) {\n\
			return new InternalResourceView(' + jstlPrefix + ' + "/' + startJspName + '.jsp");\n\
		} else {\n\
			return new InternalResourceView(' + jstlPrefix + ' + "/jsonData.jsp");\n\
		}\n\
	}\n\
}';
},
'RedirectInterceptor': function (packageName) { // JAVA
return 'package ' + packageName + '.config;\n\
\n\
import java.io.IOException;\n\
\n\
import javax.servlet.http.HttpServletRequest;\n\
import javax.servlet.http.HttpServletResponse;\n\
\n\
import org.springframework.stereotype.Component;\n\
import org.springframework.web.servlet.ModelAndView;\n\
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;\n\
\n\
@Component\n\
public class RedirectInterceptor extends HandlerInterceptorAdapter {\n\
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,\n\
			ModelAndView mav) throws Exception, IOException {\n\
		if (mav.getViewName().contains("redirect:")) {\n\
			String viewURL = mav.getViewName().substring(9);\n\
			response.sendRedirect(request.getContextPath() + viewURL);\n\
		}\n\
	}\n\
}';
  },
  'jsonData': function (packageName) { // JSP
    return '<%@ page language="java" contentType="application/json"\n\
	pageEncoding="UTF-8"%>\n\
<%@ page import="org.json.simple.JSONObject"%>\n\
<%@ page\n\
	import="' + packageName + '.config.JSONModelData"%>\n\
<%\n\
	JSONModelData modelData = new JSONModelData();\n\
	JSONObject json = modelData.getModelData(request);\n\
%>\
<%=json%>';
  }
};
