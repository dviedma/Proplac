module SiteHelpers

  def page_title
    title = "Proplac BCN"
    if data.page.title
      title << " | " + data.page.title
    end
    title
  end
  
  def page_description
    if data.page.description
      description = data.page.description
    else
      description = "Especialistas de la tabiqueria seca en Barcelona. Falsos techos, tabiquería seca, aislamientos térmicos, acústicos e ignífugos, mobiliario interior, diseño de interiores."
    end
    description
  end

end